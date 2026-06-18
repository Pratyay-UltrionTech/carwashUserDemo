import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../../src/app/context/AuthContext';
import { API_BASE } from '../../../../src/app/lib/apiBase';
import { normalizeLandingCatalogService } from '../../../../src/app/lib/catalogServiceNormalize';
import { LandingPricingCard } from './LandingPricingCard';
import './PricingSection.css';

function IconCar({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h10l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
      <circle cx="7.5" cy="17.5" r="2.5" /><circle cx="16.5" cy="17.5" r="2.5" />
    </svg>
  );
}

function IconTruck({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11v15M16 3h3l3 4v5h-6V3z" />
      <circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}

function IconCarFront({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
      <path d="M3 8h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
      <path d="M7 14h.01M17 14h.01" /><path d="M8 11h8" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function getVehicleIcon(type) {
  const key = String(type || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (/ute|truck|pickup|van/.test(key)) return IconTruck;
  if (/suv|4wd/.test(key)) return IconCar;
  if (/sedan|saloon/.test(key)) return IconCarFront;
  return IconCar;
}

function formatPrice(price) {
  const n = Number(price);
  return n % 1 === 0 ? `$${n.toFixed(0)}` : `$${n.toFixed(2)}`;
}

const PricingSection = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleBookNow = (e) => {
    e.preventDefault();
    signOut();
    navigate('/home');
  };

  const [vehicleBlocks, setVehicleBlocks] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeTab, setActiveTab] = useState('wash');
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const allServices = useMemo(() => {
    const block = vehicleBlocks.find((b) => b.vehicle_type === selectedVehicle);
    if (!block) return [];
    return block.services
      .filter((s) => s.active && s.catalog_group_id)
      .map((s) => normalizeLandingCatalogService(s))
      .sort((a, b) => a.sequence - b.sequence);
  }, [vehicleBlocks, selectedVehicle]);

  const washServices = useMemo(
    () => allServices.filter((s) => (s.category?.toLowerCase() || '') !== 'detailing'),
    [allServices],
  );

  const detailServices = useMemo(
    () => allServices.filter((s) => (s.category?.toLowerCase() || '') === 'detailing'),
    [allServices],
  );

  const hasDetailing = detailServices.length > 0;
  const activeServices = activeTab === 'wash' ? washServices : detailServices;

  useEffect(() => {
    if (!activeServices.length) {
      setSelectedServiceId(null);
      return;
    }
    setSelectedServiceId((prev) => {
      if (prev && activeServices.some((s) => s.id === prev)) return prev;
      const recommended = activeServices.find((s) => s.recommended === true);
      return (recommended ?? activeServices[0]).id;
    });
  }, [activeServices]);

  const selectedService = activeServices.find((s) => s.id === selectedServiceId) ?? null;

  return (
    <section className="ps-section sec sec-alt-mesh" id="pricing">
      <div className="ps-section-inner">
        <header className="ps-head">
          <div className="lbl">Service Pricing</div>
          <h2>Live packages for every vehicle</h2>
          <p className="sub">
            Prices pulled directly from our menu — pick your vehicle, compare packages, and book the one that fits.
          </p>
        </header>

        {loading && (
          <div className="ps-loading">
            <div className="ps-spinner" />
            <span>Loading live pricing…</span>
          </div>
        )}

        {error && (
          <div className="ps-error">
            Unable to load live pricing.{' '}
            <a href="#/home" onClick={handleBookNow}>Book online</a> to see all services.
          </div>
        )}

        {!loading && !error && vehicleBlocks.length > 0 && (
          <div className="ps-shell">
            <div className="ps-toolbar" aria-label="Filter pricing">
              <div className="ps-toolbar-group">
                <p className="ps-toolbar-label">Vehicle</p>
                <div className="ps-vehicle-row" role="group" aria-label="Select vehicle type">
                  {vehicleBlocks.map((b) => {
                    const Icon = getVehicleIcon(b.vehicle_type);
                    const isSelected = selectedVehicle === b.vehicle_type;
                    return (
                      <button
                        key={b.vehicle_type}
                        type="button"
                        className={`ps-vehicle-chip${isSelected ? ' ps-vehicle-chip--active' : ''}`}
                        onClick={() => {
                          setSelectedVehicle(b.vehicle_type);
                          setActiveTab('wash');
                        }}
                        aria-pressed={isSelected}
                      >
                        <span className="ps-vehicle-chip-icon" aria-hidden="true">
                          <Icon color="currentColor" />
                        </span>
                        <span className="ps-vehicle-chip-label">{b.vehicle_type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {hasDetailing ? (
                <div className="ps-toolbar-group ps-toolbar-group--category">
                  <p className="ps-toolbar-label">Category</p>
                  <div className="ps-segment" role="tablist" aria-label="Service category">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'wash'}
                      className={`ps-segment-btn${activeTab === 'wash' ? ' ps-segment-btn--active' : ''}`}
                      onClick={() => setActiveTab('wash')}
                    >
                      Wash
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'detail'}
                      className={`ps-segment-btn${activeTab === 'detail' ? ' ps-segment-btn--active' : ''}`}
                      onClick={() => setActiveTab('detail')}
                    >
                      Detailing
                    </button>
                  </div>
                </div>
              ) : null}

              <p className="ps-toolbar-note">
                <strong>Member perks</strong> on eligible packages — loyalty points &amp; complimentary coffee.
              </p>
            </div>

            <div className="ps-main">
              {activeServices.length > 0 ? (
                <>
                  <div className="ps-grid-header">
                    <p className="ps-grid-count">
                      {activeServices.length} package{activeServices.length === 1 ? '' : 's'} for{' '}
                      <span>{selectedVehicle}</span>
                    </p>
                    <p className="ps-grid-hint">Select a package to continue</p>
                  </div>

                  <div className="ps-grid">
                    {activeServices.map((svc) => (
                      <LandingPricingCard
                        key={svc.id}
                        title={svc.name}
                        price={svc.price}
                        durationMinutes={svc.durationMinutes}
                        descriptionPoints={svc.descriptionPoints}
                        excludedPoints={svc.excludedPoints}
                        recommended={svc.recommended === true}
                        freeCoffeeCount={svc.freeCoffeeCount}
                        eligibleForLoyaltyPoints={svc.eligibleForLoyaltyPoints === true}
                        isSelected={selectedServiceId === svc.id}
                        onClick={() => setSelectedServiceId(svc.id)}
                      />
                    ))}
                  </div>

                  {selectedService ? (
                    <div className="ps-checkout-bar">
                      <div className="ps-checkout-accent" aria-hidden="true" />
                      <div className="ps-checkout-copy">
                        <span className="ps-checkout-eyebrow">Selected package</span>
                        <p className="ps-checkout-title">
                          {selectedService.name}
                          <span className="ps-checkout-price">{formatPrice(selectedService.price)}</span>
                        </p>
                        <p className="ps-checkout-meta">
                          {selectedVehicle} · {activeTab === 'wash' ? 'Wash' : 'Detailing'}
                        </p>
                      </div>
                      <a href="#/home" className="ps-book-btn bg" onClick={handleBookNow}>
                        Book this package
                        <IconArrow />
                      </a>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="ps-empty">
                  No {activeTab === 'wash' ? 'wash' : 'detailing'} services available for this vehicle type.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
