import { useState } from 'react';
import { useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import RaffleDetailsForm from '../components/raffle/RaffleDetailsForm';
import RaffleReview from '../components/raffle/RaffleReview';
import ProgressBar from '../components/layout/ProgressBar';
import { API_BASE_URL } from '../config';


const RafflePage = () => {
    const { stepId } = useParams();
    const step = parseInt(stepId || '1', 10);
    const navigate = useNavigate();

    const location = useLocation();

    const [formData, setFormData] = useState({
        firstName: location.state?.firstName || '',
        lastName: location.state?.lastName || '',
        email: location.state?.email || '',
        phoneNumber: location.state?.phoneNumber || '',
        idNumber: location.state?.idNumber || '',
        gender: location.state?.gender || 'male',
        quantity: location.state?.quantity || '1',
        acceptedTerms: location.state?.acceptedTerms || false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!formData.firstName.trim()) errs['firstName'] = 'First name is required';
        if (!formData.lastName.trim()) errs['lastName'] = 'Last name is required';
        if (!formData.idNumber.trim()) errs['idNumber'] = 'National ID is required';
        if (!formData.acceptedTerms) errs['acceptedTerms'] = 'You must accept the terms and conditions';
        if (!formData.email.trim()) {
            errs['email'] = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errs['email'] = 'Please enter a valid email address';
        }
        const qty = parseInt(formData.quantity);
        if (isNaN(qty) || qty < 1) {
            errs['quantity'] = 'Must be at least 1 ticket';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleNext = () => {
        if (step === 1) {
            if (!validate()) return;
        }
        navigate(`/raffle/step/${step + 1}`);
    };

    const handleBack = () => {
        if (step > 1) navigate(`/raffle/step/${step - 1}`);
        else navigate('/');
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/raffle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    email: formData.email.trim().toLowerCase(),
                    phoneNumber: formData.phoneNumber.trim() || null,
                    idNumber: formData.idNumber.trim(),
                    gender: formData.gender,
                    quantity: formData.quantity,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                const msg = data?.error?.message || 'Something went wrong. Please try again.';
                setSubmitError(msg);
                return;
            }
            navigate(`/raffle/payment/${data.ticketIds[0]}`, {
                state: {
                    ...formData,
                    ticketIds: data.ticketIds,
                    amount: data.amount
                }
            });
        } catch (err) {
            setSubmitError('A network error occurred. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (step < 1 || step > 2) return <Navigate to="/raffle/step/1" replace />;

    return (
        <Layout maxWidth="max-w-5xl">
            <ProgressBar
                currentStep={step}
                stepTitle={step === 1 ? 'DETAILS' : 'REVIEW'}
                labels={['DETAILS', 'REVIEW']}
                onStepClick={(s: number) => navigate(`/raffle/step/${s}`)}
            />

            {/* Step Content */}
            {step === 1 && (
                <RaffleDetailsForm
                    data={formData}
                    onChange={setFormData}
                    onNext={handleNext}
                    errors={errors}
                />
            )}
            {step === 2 && (
                <RaffleReview
                    data={formData}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    error={submitError}
                />
            )}
        </Layout>
    );
};

export default RafflePage;
