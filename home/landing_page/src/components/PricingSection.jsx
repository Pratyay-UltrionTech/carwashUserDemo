import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { API_BASE } from '../../../../src/app/lib/apiBase';
import { normalizeLandingCatalogService } from '../../../../src/app/lib/catalogServiceNormalize';
import { flattenStoredServiceLines, parseServiceDetailRows } from '../../../../src/app/lib/serviceDetailsFormat';
import { LoyaltyCountedIcon } from '../../../../src/app/components/LoyaltyCountedIcon';
import { TakeawayCoffeeIcon } from '../../../../src/app/components/TakeawayCoffeeIcon';
import './PricingSection.css';

/* ── Inline SVG icons (lucide-style) ── */
function IconCar({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h10l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
      <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
    </svg>
  );
}
function IconTruck({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11v15M16 3h3l3 4v5h-6V3z"/>
      <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  );
}
function IconCarFront({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2"/>
      <path d="M3 8h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/>
      <path d="M7 14h.01M17 14h.01"/><path d="M8 11h8"/>
    </svg>
  );
}
function IconLayoutGrid({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  );
}
function IconCheck({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function IconX({ size = 14, color = '#d1d5db' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
function IconChevronLeft({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}
function IconChevronRight({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}
const NAVY     = '#0c1d3a';
const NAVY_MID = '#1a3560';
const NAVY_TINT = '#e8eef8';
const GOLD     = '#c9a84c';

function getVehicleIcon(type) {
  const key = String(type || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (/suv|4wd|truck|pickup|van/.test(key)) return IconTruck;
  if (/sedan|saloon/.test(key)) return IconCarFront;
  return IconCar;
}

/* ── BookingFlowSection card shell — mirrors portal's BookingFlowSection ── */
function FlowCard({ iconEl, title, badge, children, bodyClass = '' }) {
  return (
    <div className="ps-flow-card">
      <div className="ps-flow-header">
        <span className="ps-flow-icon">{iconEl}</span>
        <span className="ps-flow-title">{title}</span>
        {badge && <span className="ps-flow-badge">{badge}</span>}
      </div>
      <div className={`ps-flow-body${bodyClass ? ' ' + bodyClass : ''}`}>{children}</div>
    </div>
  );
}

/* ── Service detail rows — same as BranchSelection ServiceCard ── */
function ServiceDetailRows({ descriptionPoints, excludedPoints }) {
  const lines = flattenStoredServiceLines(descriptionPoints, excludedPoints ?? []);
  const rows = parseServiceDetailRows(lines);
  if (!rows.length) return null;
  return (
    <div className="ps-detail-rows">
      {rows.map((row, i) => {
        const prev = i > 0 ? rows[i - 1] : null;
        if (row.kind === 'heading') {
          return (
            <div key={i} className={`ps-row-heading${i > 0 ? ' ps-row-heading--gap' : ''}`}>
              <p className="ps-row-heading-text">{row.text}</p>
            </div>
          );
        }
        if (row.kind === 'included') {
          return (
            <div
              key={i}
              className={`ps-row-item${prev?.kind === 'excluded' ? ' ps-row-item--gap-included-after-excluded' : ''}`}
            >
              <span className="ps-row-check"><IconCheck size={16} color={NAVY} /></span>
              <span className="ps-row-text">{row.text}</span>
            </div>
          );
        }
        return (
          <div key={i} className={`ps-row-item${prev?.kind === 'included' || prev?.kind === 'heading' ? ' ps-row-item--gap' : ''}`}>
            <span className="ps-row-check"><IconX size={16} /></span>
            <span className="ps-row-text ps-row-text--excluded">{row.text}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Service card — badges/icons only from admin catalog flags ── */
function ServiceCard({ svc }) {
  const showRecommended = svc.recommended === true;
  const freeCoffeeCount = Math.max(0, Math.floor(Number(svc.freeCoffeeCount ?? 0)));
  const hasCoffee = freeCoffeeCount > 0;
  const hasLoyalty = svc.eligibleForLoyaltyPoints === true;
  const price = Number(svc.price);
  const priceDisplay = price % 1 === 0 ? `$${price.toFixed(0)}` : `$${price.toFixed(2)}`;
  const durationMinutes = Number(svc.durationMinutes ?? 0);
  const durationDisplay = durationMinutes > 0 ? `${durationMinutes} min` : '';

  return (
    <div className="ps-card">
      {showRecommended ? (
        <span className="ps-card-badge">Recommended</span>
      ) : null}

      <div className="ps-card-top">
        <div className="ps-card-title-row">
          <h3 className="ps-card-title">{svc.name}</h3>
          {hasCoffee ? (
            <span
              className="ps-card-perk ps-card-perk--coffee"
              title={`Complimentary takeaway coffee${freeCoffeeCount > 1 ? ` (×${freeCoffeeCount})` : ''}`}
              aria-label="Complimentary takeaway coffee"
            >
              <TakeawayCoffeeIcon size={15} />
            </span>
          ) : null}
          {hasLoyalty ? (
            <span
              className="ps-card-perk ps-card-perk--loyalty"
              title="Loyalty counted"
              aria-label="Loyalty counted"
            >
              <LoyaltyCountedIcon size={14} style={{ color: '#92650a' }} />
            </span>
          ) : null}
        </div>
        <div className="ps-card-price-col">
          <p className="ps-card-price">{priceDisplay}</p>
          {durationDisplay ? (
            <p className="ps-card-duration">{durationDisplay}</p>
          ) : null}
        </div>
      </div>

      <div className="ps-card-body">
        <ServiceDetailRows
          descriptionPoints={svc.descriptionPoints}
          excludedPoints={svc.excludedPoints}
        />
      </div>
    </div>
  );
}

const SLIDE_INTERVAL = 3500;
const SCROLL_THRESHOLD = 8;

function getCarouselVisibleCount() {
  if (typeof window === 'undefined') return 1;
  if (window.matchMedia('(min-width: 1024px)').matches) return 3;
  if (window.matchMedia('(min-width: 768px)').matches) return 2;
  return 1;
}

function useCarouselVisibleCount() {
  const [visibleCount, setVisibleCount] = useState(getCarouselVisibleCount);

  useEffect(() => {
    const mqMd = window.matchMedia('(min-width: 768px)');
    const mqLg = window.matchMedia('(min-width: 1024px)');
    const sync = () => setVisibleCount(getCarouselVisibleCount());
    sync();
    mqMd.addEventListener('change', sync);
    mqLg.addEventListener('change', sync);
    return () => {
      mqMd.removeEventListener('change', sync);
      mqLg.removeEventListener('change', sync);
    };
  }, []);

  return visibleCount;
}

const PricingSection = () => {
  const [vehicleBlocks, setVehicleBlocks] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeTab, setActiveTab] = useState('wash');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const scrollerRef = useRef(null);
  const autoSlideRef = useRef(null);
  const pausedRef = useRef(false);
  const visibleCardCount = useCarouselVisibleCount();

  /* ── Fetch ── */
  useEffect(() => {
    (async () => {
      try {
        const branchRes = await fetch(`${API_BASE}/public/branches`);
        if (!branchRes.ok) throw new Error('Failed to load branches');
        const branches = await branchRes.json();
        if (!branches.length) return;
        const branchId = branches[0].id;
        const blocksRes = await fetch(`${API_BASE}/public/branches/${branchId}/vehicle-blocks`);
        if (!blocksRes.ok) throw new Error('Failed to load services');
        const blocks = await blocksRes.json();
        setVehicleBlocks(blocks);
        if (blocks.length) setSelectedVehicle(blocks[0].vehicle_type);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Derive lists ── */
  const allServices = useMemo(() => {
    const block = vehicleBlocks.find((b) => b.vehicle_type === selectedVehicle);
    if (!block) return [];
    return block.services
      .filter((s) => s.active && s.catalog_group_id)
      .map((s) => normalizeLandingCatalogService(s))
      .sort((a, b) => a.sequence - b.sequence);
  }, [vehicleBlocks, selectedVehicle]);

  const washServices   = useMemo(() => allServices.filter((s) => (s.category?.toLowerCase() || '') !== 'detailing'), [allServices]);
  const detailServices = useMemo(() => allServices.filter((s) => (s.category?.toLowerCase() || '') === 'detailing'), [allServices]);
  const hasDetailing   = detailServices.length > 0;
  const activeServices = activeTab === 'wash' ? washServices : detailServices;

  /* ── Scroll helpers ── */
  const updateScrollBtns = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) { setCanScrollPrev(false); setCanScrollNext(false); return; }
    setCanScrollPrev(el.scrollLeft > SCROLL_THRESHOLD);
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - SCROLL_THRESHOLD);
  }, []);

  const getCards = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return [];
    const track = el.firstElementChild;
    return track ? Array.from(track.children) : [];
  }, []);

  const maxScrollIdx = useCallback(
    (cardLen) => Math.max(0, cardLen - visibleCardCount),
    [visibleCardCount],
  );

  const scrollToIdx = useCallback((idx) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cards = getCards();
    if (!cards.length) return;
    const pad = cards[0].offsetLeft;
    const i = Math.max(0, Math.min(maxScrollIdx(cards.length), idx));
    el.scrollTo({ left: cards[i].offsetLeft - pad, behavior: 'smooth' });
  }, [getCards, maxScrollIdx]);

  const getCurrentIdx = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return 0;
    const cards = getCards();
    if (!cards.length) return 0;
    const pad = cards[0].offsetLeft;
    let idx = 0;
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].offsetLeft - pad <= el.scrollLeft + 1) idx = i;
      else break;
    }
    return Math.min(maxScrollIdx(cards.length), idx);
  }, [getCards, maxScrollIdx]);

  const doScrollPrev = useCallback(() => {
    const current = getCurrentIdx();
    if (current > 0) scrollToIdx(current - 1);
    else if (activeTab === 'detail') setActiveTab('wash');
  }, [scrollToIdx, getCurrentIdx, activeTab]);

  const doScrollNext = useCallback(() => {
    const cards = getCards();
    const current = getCurrentIdx();
    const maxIdx = maxScrollIdx(cards.length);
    if (current < maxIdx) scrollToIdx(current + 1);
    else if (activeTab === 'wash' && hasDetailing) setActiveTab('detail');
  }, [scrollToIdx, getCurrentIdx, getCards, maxScrollIdx, activeTab, hasDetailing]);

  const canGoLeft  = canScrollPrev || activeTab === 'detail';
  const canGoRight = canScrollNext || (activeTab === 'wash' && hasDetailing);

  /* ── Auto-slide ── */
  useEffect(() => {
    clearInterval(autoSlideRef.current);
    if (activeServices.length <= 1) return;
    autoSlideRef.current = setInterval(() => {
      if (!pausedRef.current) doScrollNext();
    }, SLIDE_INTERVAL);
    return () => clearInterval(autoSlideRef.current);
  }, [activeServices.length, doScrollNext]);

  /* ── Reset on tab / vehicle change ── */
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollLeft = 0;
    setCanScrollPrev(false);
    setCanScrollNext(false);
    requestAnimationFrame(() => requestAnimationFrame(updateScrollBtns));
  }, [activeTab, selectedVehicle, updateScrollBtns]);

  /* ── ResizeObserver ── */
  useEffect(() => {
    let ro = null;
    const t = requestAnimationFrame(() => {
      const el = scrollerRef.current;
      if (!el) return;
      ro = new ResizeObserver(updateScrollBtns);
      ro.observe(el);
      updateScrollBtns();
    });
    return () => { cancelAnimationFrame(t); ro?.disconnect(); };
  }, [activeTab, activeServices.length, selectedVehicle, visibleCardCount, updateScrollBtns]);

  const selectedBodyLabel = vehicleBlocks.find((b) => b.vehicle_type === selectedVehicle)?.vehicle_type ?? '';

  return (
    <section className="ps-section sec" id="pricing">
      <div className="ps-section-inner">
        <h2>Service Pricing</h2>
        <p className="ps-section-subtitle">Select your vehicle and explore wash or detailing packages tailored for your car.</p>

        {loading && (
          <div className="ps-loading">
            <div className="ps-spinner" />
            <span>Loading services…</span>
          </div>
        )}
        {error && (
          <div className="ps-error">
            Unable to load live pricing. <a href="#/home">Book online</a> to see all services.
          </div>
        )}

        {!loading && !error && vehicleBlocks.length > 0 && (
          <div className="ps-cards-wrap">

          {/* ── Card 1: Vehicle selection ── */}
          <FlowCard
            iconEl={<IconCar size={16} color={NAVY} />}
            title="Select your vehicle"
            badge={selectedBodyLabel || undefined}
          >
            <p className="ps-body-label">Body type</p>
            <div className="ps-vehicles" role="group" aria-label="Select vehicle type">
              {vehicleBlocks.map((b) => {
                const Icon = getVehicleIcon(b.vehicle_type);
                const isSelected = selectedVehicle === b.vehicle_type;
                return (
                  <button
                    key={b.vehicle_type}
                    type="button"
                    className={`ps-vcard${isSelected ? ' ps-vcard--active' : ''}`}
                    onClick={() => { setSelectedVehicle(b.vehicle_type); setActiveTab('wash'); }}
                    aria-pressed={isSelected}
                  >
                    <span className={`ps-vcard-icon${isSelected ? ' ps-vcard-icon--active' : ''}`}>
                      <Icon size={20} color={isSelected ? NAVY : NAVY_MID} />
                    </span>
                    <span className="ps-vcard-label">{b.vehicle_type}</span>
                  </button>
                );
              })}
            </div>
          </FlowCard>

          {/* ── Card 2: Service selection ── */}
          <FlowCard
            iconEl={<IconLayoutGrid size={16} color={NAVY} />}
            title="Choose your package"
            badge={activeTab === 'wash' ? 'Wash' : 'Detailing'}
            bodyClass="ps-flow-body--overflow"
          >
            {/* Wash / Detailing toggle */}
            {hasDetailing && (
              <div className="ps-toggle-wrap">
                <div className="ps-toggle" role="tablist" aria-label="Service category">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'wash'}
                    className={`ps-toggle-btn${activeTab === 'wash' ? ' ps-toggle-btn--active' : ''}`}
                    onClick={() => setActiveTab('wash')}
                  >
                    <span className="ps-toggle-btn-long">Wash service</span>
                    <span className="ps-toggle-btn-short">Wash</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'detail'}
                    className={`ps-toggle-btn${activeTab === 'detail' ? ' ps-toggle-btn--active' : ''}`}
                    onClick={() => setActiveTab('detail')}
                  >
                    <span className="ps-toggle-btn-long">Detailing service</span>
                    <span className="ps-toggle-btn-short">Detailing</span>
                  </button>
                </div>
              </div>
            )}

            {/* Carousel */}
            {activeServices.length > 0 ? (
              <div
                className="ps-carousel-wrap"
                onMouseEnter={() => { pausedRef.current = true; }}
                onMouseLeave={() => { pausedRef.current = false; }}
              >
                {/* Clip wrapper — same as portal's overflow-hidden rounded-lg */}
                <div className="ps-clip">
                  <div
                    ref={scrollerRef}
                    className="ps-scroller"
                    onScroll={updateScrollBtns}
                  >
                    <div className="ps-track">
                      {activeServices.map((svc) => (
                        <div key={svc.id} className="ps-slide">
                          <ServiceCard svc={svc} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating arrows — outside clip, inside carousel-wrap */}
                <button
                  type="button"
                  className={`ps-arrow ps-arrow--prev${!canGoLeft ? ' ps-arrow--disabled' : ''}`}
                  onClick={doScrollPrev}
                  disabled={!canGoLeft}
                  aria-label="Previous services"
                >
                  <IconChevronLeft size={20} color={NAVY} />
                </button>
                <button
                  type="button"
                  className={`ps-arrow ps-arrow--next${!canGoRight ? ' ps-arrow--disabled' : ''}`}
                  onClick={doScrollNext}
                  disabled={!canGoRight}
                  aria-label="Next services"
                >
                  <IconChevronRight size={20} color={NAVY} />
                </button>
              </div>
            ) : (
              <p className="ps-empty">
                No {activeTab === 'wash' ? 'wash' : 'detailing'} services available for this vehicle type.
              </p>
            )}

            {activeServices.length > 0 ? (
              <div className="ps-package-footer">
                <a href="#/home" className="ps-book-btn">
                  Book Now
                </a>
              </div>
            ) : null}
          </FlowCard>

          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
