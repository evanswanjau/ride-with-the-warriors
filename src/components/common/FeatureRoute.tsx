import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isOn, type Feature } from '../../config/features';

/** Renders its children only when the feature switch is on; otherwise sends the visitor home. */
export function FeatureRoute({ feature, children }: { feature: Feature; children: ReactNode }) {
    return isOn(feature) ? <>{children}</> : <Navigate to="/" replace />;
}
