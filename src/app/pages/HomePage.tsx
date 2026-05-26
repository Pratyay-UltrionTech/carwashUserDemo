import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  MapPin, Building2, Car, Clock, Calendar,
  Zap, TrendingDown, Sparkles, Check, ArrowRight,
  LayoutGrid,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { listBranches, listHomeOffers, syncAdminStateFromPortal } from '../lib/adminPortalBridge';
import { checkMobileServiceability, fetchMobileSnapshot } from '../lib/mobilePublicBridge';
import { normalizePinDigits } from '../lib/mobileVisitAddress';
import { useAdminBridgeSync } from '../hooks/useAdminBridgeSync';
import { AddressDetailsFields } from '../components/AddressDetailsFields';
import {
  createEmptyAddressDetails,
  isAddressComplete,
  sanitizePostcode,
  validateRequiredAddress,
  withFullAddress,
  type AddressDetails,
} from '../lib/addressDetails';
import { apiListAddresses, type SavedAddress } from '../lib/userApi';
import { BrandLoading } from '../components/BrandLoading';

const NAVY      = '#0c1d3a';
const NAVY_TINT = '#e8eef8';
const GOLD      = '#c9a84c';
const BTN_BG    = '#c9a84c';
const BTN_TEXT  = '#0c1d3a';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1680533749371-59c49b31fd74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

/* ─── offer style pools ─── */
const STYLE_POOL = [
  { icon: Clock,       grad: 'from-orange-500 to-rose-500',   bg: 'bg-orange-50',  border: 'border-orange-200'  },
  { icon: Calendar,    grad: 'from-sky-500 to-blue-600',       bg: 'bg-sky-50',     border: 'border-sky-200'     },
  { icon: TrendingDown, grad: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
] as const;

export function HomePage() {
  const navigate = useNavigate();
  const { resetBooking, setSelectedBranch, setServiceType, mobileVisitAddress, setMobileVisitAddress } = useBooking();
  const { session } = useAuth();
  const [mobileLocation, setMobileLocation] = useState(() =>
    sanitizePostcode(mobileVisitAddress?.postcode ?? ''),
  );
  const [mobileBusy, setMobileBusy]         = useState(false);
  const [mobileError, setMobileError]       = useState('');
  /** After PIN is verified: collect full address in-card before continuing to booking. */
  const [mobileCardStep, setMobileCardStep] = useState<'pin' | 'address'>(() => (
    mobileVisitAddress?.postcode ? 'address' : 'pin'
  ));
  const [mobileCityPinCode, setMobileCityPinCode] = useState('');
  const [mobileAcceptedPins, setMobileAcceptedPins] = useState<string[]>([]);
  const [mobileAddress, setMobileAddress] = useState<AddressDetails>(() => (
    mobileVisitAddress
      ? {
          street_address: mobileVisitAddress.street_address ?? '',
          suburb: mobileVisitAddress.suburb ?? '',
          state: mobileVisitAddress.state ?? '',
          postcode: sanitizePostcode(mobileVisitAddress.postcode ?? ''),
        }
      : createEmptyAddressDetails()
  ));
  const [addressTouched, setAddressTouched] = useState(false);
  const [mobileAddressError, setMobileAddressError] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);
  const streetInputRef = useRef<HTMLInputElement | null>(null);
  const syncSeed = useAdminBridgeSync(60000);
  const [isReady, setIsReady] = useState(false);

  const BRANCHES = useMemo(
    () =>
      listBranches('').map((b, idx) => ({
        ...b,
        rating: 4.6 + ((idx % 4) * 0.1),
        image: FALLBACK_IMAGE,
      })),
    [syncSeed]
  );

  const PROMOTIONS = useMemo(() => {
    return listHomeOffers().slice(0, 12).map((offer, idx) => ({
      ...offer,
      discount: offer.discountLabel,
      time: offer.timeLabel,
      ...STYLE_POOL[idx % STYLE_POOL.length],
    }));
  }, [syncSeed]);

  // Block the page until the initial catalog sync completes.
  // Falls back to showing the page after 6 s in case of a slow/failed network.
  useEffect(() => {
    let cancelled = false;
    const fallback = window.setTimeout(() => {
      if (!cancelled) setIsReady(true);
    }, 6000);
    void syncAdminStateFromPortal().finally(() => {
      if (!cancelled) {
        setIsReady(true);
        window.clearTimeout(fallback);
      }
    });
    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, []);

  // Fetch saved addresses once for logged-in users (used in mobile flow)
  useEffect(() => {
    if (!session?.accessToken) return;
    apiListAddresses(session.accessToken)
      .then((res) => setSavedAddresses(Array.isArray(res?.addresses) ? res.addresses : []))
      .catch(() => {
        setSavedAddresses([]);
      });
  }, [session?.accessToken]);

  useEffect(() => {
    if (mobileCardStep !== 'address') return;
    const handle = window.setTimeout(() => streetInputRef.current?.focus(), 220);
    return () => window.clearTimeout(handle);
  }, [mobileCardStep]);

  const handleBranchSelect = (branchId: string) => {
    const b = BRANCHES.find(x => x.id === branchId);
    if (b) {
      resetBooking();
      setServiceType('branch');
      setSelectedBranch({ id: b.id, name: b.name, location: b.location, rating: b.rating, image: b.image });
    }
    navigate(`/branch/${branchId}?serviceType=branch`);
  };

  const handleMobileCheckPin = async () => {
    const pin = sanitizePostcode(mobileLocation);
    if (pin.length < 4 || pin.length > 6) {
      setMobileError('Enter a 4–6 digit postcode or PIN.');
      return;
    }
    setMobileBusy(true);
    setMobileError('');
    setMobileAddressError('');
    try {
      const serviceability = await checkMobileServiceability(pin);
      if (!serviceability.serviceable) {
        setMobileError('This postcode is outside our current mobile service coverage.');
        return;
      }
      const snapshot = await fetchMobileSnapshot(serviceability.city_pin_code);
      const hub = snapshot.service_area.city_pin_code;
      const requested = snapshot.service_area.requested_pin_code;
      setMobileCityPinCode(hub);
      setMobileAcceptedPins(
        [...new Set([hub, requested, pin].map((s) => String(s ?? '').trim()).filter(Boolean))],
      );
      const verifiedPostcode = sanitizePostcode(pin);
      const previousPostcode = sanitizePostcode(mobileAddress.postcode);
      const keepExisting = previousPostcode === verifiedPostcode && mobileAddress.street_address.trim().length > 0;

      // Find saved addresses whose postcode matches the verified postcode
      const matching = savedAddresses.filter(
        (a) => sanitizePostcode(a.postcode) === verifiedPostcode,
      );

      if (keepExisting) {
        setMobileAddress((prev) => ({ ...prev, postcode: verifiedPostcode }));
        setSelectedSavedId(null);
      } else if (matching.length === 1) {
        // Exactly one match — auto-fill it
        const a = matching[0];
        setMobileAddress({ street_address: a.street_address, suburb: a.suburb, state: a.state, postcode: verifiedPostcode });
        setSelectedSavedId(a.id);
      } else if (matching.length > 1) {
        // Multiple matches — show selector, pre-select the default if present
        const def = matching.find((a) => a.is_default) ?? matching[0];
        setMobileAddress({ street_address: def.street_address, suburb: def.suburb, state: def.state, postcode: verifiedPostcode });
        setSelectedSavedId(def.id);
      } else {
        // No saved match — clear fields, let user type manually
        setMobileAddress({ street_address: '', suburb: '', state: '', postcode: verifiedPostcode });
        setSelectedSavedId(null);
      }
      setAddressTouched(false);
      setMobileCardStep('address');
    } catch {
      setMobileError('Could not verify this location. Please try again.');
    } finally {
      setMobileBusy(false);
    }
  };

  const handleMobileAddressContinue = () => {
    setAddressTouched(true);
    setMobileAddressError('');
    const validation = validateRequiredAddress(mobileAddress);
    if (validation.street_address || validation.suburb || validation.state || validation.postcode) {
      setMobileAddressError('Please complete all required address fields before continuing.');
      return;
    }
    const normalizedInputPostcode = sanitizePostcode(mobileAddress.postcode);
    const accepted = new Set(mobileAcceptedPins.map((p) => sanitizePostcode(p)).filter(Boolean));
    if (accepted.size > 0 && !accepted.has(normalizedInputPostcode)) {
      const hint = [...new Set(mobileAcceptedPins.map((p) => normalizePinDigits(p)).filter(Boolean))].join(' or ');
      setMobileAddressError(hint ? `Postcode must match ${hint}.` : 'Postcode must match the verified postcode.');
      return;
    }
    const structuredAddress = withFullAddress(mobileAddress);
    resetBooking();
    setMobileVisitAddress(structuredAddress);
    setServiceType('onsite');
    setSelectedBranch({
      id: `mobile-${mobileCityPinCode}`,
      name: 'Mobile Service',
      location: `Postcode ${mobileCityPinCode}`,
      rating: 0,
      image: '',
    });
    navigate(`/branch/mobile?serviceType=onsite&pin=${encodeURIComponent(mobileCityPinCode)}`);
  };

  const firstName = session?.fullName?.split(' ')[0];
  const addressErrors = addressTouched ? validateRequiredAddress(mobileAddress) : {};
  const canContinueToBooking = isAddressComplete(mobileAddress) && !!mobileCityPinCode;

  const verifiedPostcode = sanitizePostcode(mobileLocation);
  const mobilePinValid = verifiedPostcode.length >= 4 && verifiedPostcode.length <= 6;
  const matchingAddresses = useMemo(
    () => savedAddresses.filter((a) => sanitizePostcode(a.postcode) === verifiedPostcode),
    [savedAddresses, verifiedPostcode],
  );

  return (
    <div className="relative min-h-screen" style={{ background: '#eef3fa' }}>
      {/* Loading overlay — sits above blurred content */}
      {!isReady && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="flex flex-col items-center gap-4 rounded-2xl px-10 py-8"
            style={{
              background: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              boxShadow: '0 8px 40px rgba(12,29,58,0.13)',
            }}
          >
            <BrandLoading label="Loading availability…" />
          </div>
        </div>
      )}

    <div
      className={!isReady ? 'pointer-events-none select-none blur-sm brightness-90 transition-[filter] duration-300' : 'transition-[filter] duration-300'}
    >
    <div className="min-h-screen" style={{ background: '#eef3fa' }}>
      {/* gold accent bar */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${GOLD} 0%, #e8c97a 50%, transparent 100%)` }} />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* ── Welcome ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: NAVY }}
          >
            {firstName ? `Welcome back, ${firstName}` : 'Welcome to Lumi Car Spa'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Your Hills shine specialist — book a service in under two minutes.
          </p>
        </motion.div>

        {/* ── Promo banner (only if offers exist) ── */}
        {PROMOTIONS.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 }}
            className="relative overflow-hidden rounded-2xl p-5"
            style={{
              background: `linear-gradient(135deg, ${NAVY} 0%, #1a3560 100%)`,
              boxShadow: `0 8px 32px rgba(12,29,58,0.2)`,
            }}
          >
            {/* decorative rings */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-1/2 translate-x-1/2 opacity-10"
              style={{ border: '30px solid #c9a84c' }} />
            <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full translate-y-1/2 -translate-x-1/2 opacity-10"
              style={{ border: '20px solid #c9a84c' }} />

            <div className="relative z-10 flex items-start gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="shrink-0 mt-0.5"
              >
                <Sparkles className="h-5 w-5" style={{ color: GOLD }} />
              </motion.div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(201,168,76,0.25)', color: GOLD }}
                  >
                    Active Offers
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">
                  Save with time-based pricing
                </h3>
                <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Book during off-peak hours and enjoy exclusive savings across all services.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Active Offer tiles — infinite marquee ── */}
        {PROMOTIONS.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4" style={{ color: NAVY }} />
              <h3 className="text-base font-semibold" style={{ color: NAVY, fontFamily: "'Playfair Display', serif" }}>
                Current Offers
              </h3>
            </div>

            {/* Inject keyframes once */}
            <style>{`
              @keyframes marquee-scroll {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .marquee-track {
                animation: marquee-scroll ${Math.max(12, PROMOTIONS.length * 4)}s linear infinite;
              }
              .marquee-track:hover {
                animation-play-state: paused;
              }
            `}</style>

            {/* Outer mask — hides overflow, fades edges */}
            <div
              className="relative overflow-hidden"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
              }}
            >
              {/* Inner track — contains 2× the cards for seamless loop */}
              <div className="marquee-track flex gap-3" style={{ width: 'max-content' }}>
                {[...PROMOTIONS, ...PROMOTIONS].map((promo, index) => {
                  const Icon = promo.icon;
                  return (
                    <div
                      key={`${promo.id}-${index}`}
                      className={`${promo.bg} border ${promo.border} group relative cursor-pointer overflow-hidden rounded-xl p-4 shrink-0 w-[260px] transition-transform duration-200 hover:-translate-y-1 hover:scale-[1.01]`}
                    >
                      {/* hover gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${promo.grad} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.08]`} />

                      <div className="relative z-10">
                        {/* icon + discount badge */}
                        <div className="flex items-start justify-between mb-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${promo.grad} shadow-sm`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <motion.span
                            animate={{ scale: [1, 1.04, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                            className={`rounded-full bg-white px-2.5 py-0.5 shadow-sm text-xs font-bold bg-gradient-to-r ${promo.grad} bg-clip-text text-transparent`}
                          >
                            {promo.discount}
                          </motion.span>
                        </div>

                        {/* service scope badge */}
                        <div className="mb-2 flex items-center gap-1.5">
                          <span
                            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold"
                            style={{ background: NAVY_TINT, color: NAVY }}
                          >
                            {promo.serviceType === 'branch' ? (
                              <><Building2 className="h-2.5 w-2.5" />Branch only</>
                            ) : promo.serviceType === 'mobile' ? (
                              <><Car className="h-2.5 w-2.5" />Mobile only</>
                            ) : (
                              <><Check className="h-2.5 w-2.5" />All services</>
                            )}
                          </span>
                        </div>

                        <h4 className="font-semibold text-gray-900 leading-snug text-sm mb-1">{promo.title}</h4>
                        <p className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                          <Clock className="h-3 w-3 shrink-0" />{promo.time}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-gray-400">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {promo.branches[0] === 'All Branches' ? 'All locations' : promo.branches.join(', ')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Book Your Wash ── */}
        <motion.section
          id="home-booking"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="scroll-mt-24"
        >
          <div className="mb-5">
            <h3
              className="text-base font-semibold mb-0.5"
              style={{ color: NAVY, fontFamily: "'Playfair Display', serif" }}
            >
              Book Your Wash
            </h3>
            <p className="text-xs text-gray-500">Choose how you'd like your car serviced today.</p>
          </div>

          {/* ── Two equal-height side-by-side tiles (h-full so both fill the grid row) ── */}
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">

            {/* ── Tile 1: Coonara Wash (branch) ── */}
            {BRANCHES.length === 0 ? (
              <div
                className="rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center"
                style={{ borderColor: NAVY_TINT, minHeight: 320 }}
              >
                <Building2 className="w-8 h-8 mb-3 opacity-30" style={{ color: NAVY }} />
                <p className="text-sm text-gray-400">No locations available at this time.</p>
              </div>
            ) : (
              BRANCHES.map((branch, index) => (
                <motion.button
                  key={branch.id}
                  type="button"
                  onClick={() => handleBranchSelect(branch.id)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  whileHover={{ y: -3 }}
                  className="group flex min-h-0 flex-col text-left rounded-2xl border-2 overflow-hidden transition-all duration-200 hover:shadow-xl w-full"
                  style={{ background: NAVY, borderColor: NAVY, boxShadow: '0 4px 20px rgba(12,29,58,0.18)' }}
                >
                  {/* top section — flex-1 + mt-auto on perks avoids a dead gap under the list when the card stretches */}
                  <div className="flex min-h-0 flex-1 flex-col px-5 pt-5 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(201,168,76,0.2)' }}>
                        <Building2 className="w-5 h-5" style={{ color: GOLD }} />
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(201,168,76,0.15)', color: GOLD }}>
                        In-Bay Wash
                      </span>
                    </div>

                    <p className="text-base font-bold text-white leading-snug mb-1"
                      style={{ fontFamily: "'Playfair Display', serif" }}>
                      {branch.name}
                    </p>
                    <p className="flex items-start gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{branch.location}</span>
                    </p>

                    {/* stats + perks — mt-auto pins this block to the footer so extra card height sits above, not between perks */}
                    <div className="mt-auto flex flex-col gap-4 pt-5">
                      <div
                        className="flex items-center gap-3 rounded-xl border px-3 py-3"
                        style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
                      >
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                          style={{ background: 'rgba(201,168,76,0.15)' }}
                        >
                          <LayoutGrid className="h-5 w-5" style={{ color: GOLD }} />
                        </span>
                        <div className="min-w-0">
                          
                          <p className="text-base font-bold tabular-nums leading-tight text-white">
                            {branch.bayCount}
                            <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                              {' '}
                              Wash Bays
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {[
                          'Trained detailing specialists',
                          'Walk-in friendly',
                          'Complimentary coffee on selected services',
                        ].map(perk => (
                          <div key={perk} className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                              style={{ background: 'rgba(201,168,76,0.2)' }}>
                              <Check className="w-2.5 h-2.5" style={{ color: GOLD }} />
                            </span>
                            <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.65)' }}>{perk}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* footer */}
                  <div className="px-5 py-3.5 flex items-center justify-between"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      <Clock className="h-3 w-3 shrink-0" />
                      {branch.openTime} – {branch.closeTime}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2"
                      style={{ color: GOLD }}>
                      Book now <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.button>
              ))
            )}

            {/* ── Tile 2: Mobile Service ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="flex min-h-0 flex-col rounded-2xl border-2 overflow-hidden"
              style={{ background: '#fff', borderColor: 'rgba(12,29,58,0.12)' }}
            >
              {/* top section */}
              <div className="px-5 pt-5 pb-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: NAVY_TINT }}>
                    <Car className="w-5 h-5" style={{ color: NAVY }} />
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: NAVY_TINT, color: NAVY }}>
                    We Come to You
                  </span>
                </div>

                <p className="text-base font-bold leading-snug mb-1"
                  style={{ fontFamily: "'Playfair Display', serif", color: NAVY }}>
                  Mobile Service
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  {mobileCardStep === 'pin'
                    ? 'Enter your postcode to check if a driver can reach your area.'
                    : 'Great — mobile wash is available. Enter the full address where we should meet you (include the same postcode).'}
                </p>

                {/* form — PIN step then address step in the same card */}
                <div className="flex min-h-0 flex-1 flex-col gap-3">
                  {mobileCardStep === 'pin' ? (
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                        style={{ color: NAVY }} />
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        maxLength={6}
                        value={mobileLocation}
                        onChange={(e) => {
                          setMobileLocation(sanitizePostcode(e.target.value));
                          setMobileError('');
                        }}
                        onKeyDown={e => { if (e.key === 'Enter' && mobilePinValid) void handleMobileCheckPin(); }}
                        placeholder="e.g. 2125 or 721101"
                        aria-label="Postcode or service PIN (4–6 digits)"
                        className="h-12 w-full rounded-xl border pl-10 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-transparent focus:ring-2"
                        style={{ borderColor: 'rgba(12,29,58,0.18)', ['--tw-ring-color' as any]: NAVY }}
                      />
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs text-gray-600">
                          Postcode checked:{' '}
                          <span className="font-semibold tabular-nums" style={{ color: NAVY }}>
                            {normalizePinDigits(mobileLocation) || mobileLocation}
                          </span>
                        </p>
                        <button
                          type="button"
                          className="text-xs font-semibold underline-offset-2 hover:underline"
                          style={{ color: NAVY }}
                          onClick={() => {
                            setMobileCardStep('pin');
                            setMobileAddressError('');
                          }}
                        >
                          Change postcode
                        </button>
                      </div>

                      {/* ── Saved address selector ── */}
                      {matchingAddresses.length > 0 && (
                        <div className="rounded-xl border p-3 space-y-2" style={{ borderColor: 'rgba(12,29,58,0.12)', background: NAVY_TINT }}>
                          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: NAVY }}>
                            Saved Addresses
                          </p>
                          {matchingAddresses.map((addr) => (
                            <button
                              key={addr.id}
                              type="button"
                              onClick={() => {
                                setSelectedSavedId(addr.id);
                                setMobileAddress({
                                  street_address: addr.street_address,
                                  suburb: addr.suburb,
                                  state: addr.state,
                                  postcode: sanitizePostcode(addr.postcode || mobileLocation),
                                });
                                setMobileAddressError('');
                                setAddressTouched(false);
                              }}
                              className="w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-lg border-2 transition-all"
                              style={{
                                background: selectedSavedId === addr.id ? '#fff' : 'rgba(255,255,255,0.5)',
                                borderColor: selectedSavedId === addr.id ? NAVY : 'rgba(12,29,58,0.15)',
                              }}
                            >
                              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all"
                                style={{ borderColor: selectedSavedId === addr.id ? NAVY : '#cbd5e1' }}>
                                {selectedSavedId === addr.id && (
                                  <span className="h-2 w-2 rounded-full" style={{ background: NAVY }} />
                                )}
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold" style={{ color: NAVY }}>{addr.label}</p>
                                <p className="text-xs text-gray-500 mt-0.5 leading-snug truncate">
                                  {[addr.street_address, addr.suburb, [addr.state, addr.postcode].filter(Boolean).join(' ')].filter(Boolean).join(', ')}
                                </p>
                              </div>
                            </button>
                          ))}
                          {selectedSavedId && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSavedId(null);
                                setMobileAddress({ street_address: '', suburb: '', state: '', postcode: sanitizePostcode(mobileLocation) });
                                setAddressTouched(false);
                                setMobileAddressError('');
                                setTimeout(() => streetInputRef.current?.focus(), 80);
                              }}
                              className="text-xs font-medium underline-offset-2 hover:underline"
                              style={{ color: NAVY }}
                            >
                              Enter a different address
                            </button>
                          )}
                        </div>
                      )}

                      {/* ── Manual fields — always shown, pre-filled when saved address selected ── */}
                      <AddressDetailsFields
                        value={mobileAddress}
                        onChange={(next) => {
                          setMobileAddress(next);
                          setMobileAddressError('');
                          // If user edits away from the saved address, deselect it
                          if (selectedSavedId) setSelectedSavedId(null);
                        }}
                        postcodeLocked
                        required
                        errors={addressErrors}
                        focusStyle={{ ['--tw-ring-color' as any]: NAVY }}
                        streetInputRef={streetInputRef}
                      />
                    </motion.div>
                  )}

                  {mobileError && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <span>⚠</span>{mobileError}
                    </p>
                  )}
                  {mobileAddressError && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <span>⚠</span>{mobileAddressError}
                    </p>
                  )}

                  {mobileCardStep === 'pin' ? (
                  <button
                    type="button"
                    onClick={() => void handleMobileCheckPin()}
                    disabled={!mobilePinValid || mobileBusy}
                    className="flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      background: mobilePinValid && !mobileBusy ? BTN_BG : '#e5e7eb',
                      color:      mobilePinValid && !mobileBusy ? BTN_TEXT : '#9ca3af',
                      boxShadow:  mobilePinValid && !mobileBusy ? '0 4px 14px rgba(201,168,76,0.35)' : 'none',
                    }}
                  >
                    {mobileBusy ? (
                      <>
                        <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Checking…
                      </>
                    ) : (
                      <>Check availability <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                  ) : (
                  <button
                    type="button"
                    onClick={handleMobileAddressContinue}
                    disabled={!canContinueToBooking}
                    className="flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      background: canContinueToBooking ? BTN_BG : '#e5e7eb',
                      color:      canContinueToBooking ? BTN_TEXT : '#9ca3af',
                      boxShadow:  canContinueToBooking ? '0 4px 14px rgba(201,168,76,0.35)' : 'none',
                    }}
                  >
                    Continue to booking <ArrowRight className="w-4 h-4" />
                  </button>
                  )}

                  {/* highlights — single row, icon + label (no bordered pills) */}
                  <div className="mt-auto flex min-h-0 flex-1 flex-col justify-end">
                    <div
                      className="flex flex-nowrap items-center justify-between gap-2 overflow-x-auto pt-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      style={{ borderTop: '1px solid rgba(12,29,58,0.06)' }}
                    >
                      {[
                        { icon: Car,      text: 'We come to you' },
                        { icon: Clock,    text: 'Flexible scheduling' },
                        { icon: Sparkles, text: 'Premium finish' },
                      ].map(({ icon: Icon, text }) => (
                        <span
                          key={text}
                          className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap text-[11px] font-semibold tracking-tight sm:text-xs"
                          style={{ color: NAVY }}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" style={{ color: NAVY }} />
                          {text}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* footer — mirrors branch tile footer height */}
              <div className="px-5 py-3.5 flex items-center justify-between"
                style={{ borderTop: '1px solid rgba(12,29,58,0.06)' }}>
                <span className="text-xs text-gray-400">
                  {mobileCardStep === 'pin' ? 'Mobile service · Postcode check' : 'Mobile service · Service address'}
                </span>
                <span className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
              </div>
            </motion.div>

          </div>
        </motion.section>
      </div>
    </div>
    </div>
    </div>
  );
}
