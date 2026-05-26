import type { CSSProperties, RefObject } from 'react';
import { sanitizePostcode, type AddressDetails } from '../lib/addressDetails';
import { AuStateSelect } from './AuStateSelect';

const inp =
  'w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:border-transparent';

type Props = {
  value: AddressDetails;
  onChange: (next: AddressDetails) => void;
  postcodeLocked?: boolean;
  streetInputRef?: RefObject<HTMLInputElement | null>;
  errors?: Partial<Record<keyof AddressDetails, string>>;
  required?: boolean;
  focusStyle?: CSSProperties;
  className?: string;
};

export function AddressDetailsFields({
  value,
  onChange,
  postcodeLocked = false,
  streetInputRef,
  errors,
  required = false,
  focusStyle,
  className = '',
}: Props) {
  const req = required ? <span className="text-red-500 ml-0.5">*</span> : null;
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
          Street Address{req}
        </label>
        <input
          ref={streetInputRef}
          type="text"
          value={value.street_address}
          onChange={(e) => onChange({ ...value, street_address: e.target.value })}
          placeholder="e.g. 123 Main Street"
          style={focusStyle}
          className={`${inp} ${errors?.street_address ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
        />
        {errors?.street_address ? <p className="text-xs text-red-500 mt-1.5">{errors.street_address}</p> : null}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
          Suburb{req}
        </label>
        <input
          type="text"
          value={value.suburb}
          onChange={(e) => onChange({ ...value, suburb: e.target.value })}
          placeholder="e.g. West Pennant Hills"
          style={focusStyle}
          className={`${inp} ${errors?.suburb ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
        />
        {errors?.suburb ? <p className="text-xs text-red-500 mt-1.5">{errors.suburb}</p> : null}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="min-w-0">
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
            State{req}
          </label>
          <AuStateSelect
            value={value.state}
            onChange={(state) => onChange({ ...value, state })}
            className={inp}
            hasError={Boolean(errors?.state)}
            focusStyle={focusStyle}
          />
          {errors?.state ? <p className="text-xs text-red-500 mt-1.5">{errors.state}</p> : null}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
            Postcode{req}
          </label>
          <input
            type="text"
            maxLength={6}
            readOnly={postcodeLocked}
            disabled={postcodeLocked}
            value={sanitizePostcode(value.postcode)}
            onChange={(e) => onChange({ ...value, postcode: sanitizePostcode(e.target.value) })}
            placeholder="e.g. 2125"
            style={focusStyle}
            className={`${inp} ${postcodeLocked ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''} ${errors?.postcode ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
          />
          {errors?.postcode ? <p className="text-xs text-red-500 mt-1.5">{errors.postcode}</p> : null}
        </div>
      </div>
    </div>
  );
}
