import { useState } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import RaffleDetailsForm from '../components/RaffleDetailsForm';
import RaffleReview from '../components/RaffleReview';
import { API_BASE_URL } from '../config';

const STEPS = ['YOUR DETAILS', 'CONFIRM'];

const RafflePage = () => {
    const { stepId } = useParams();
    const step = parseInt(stepId || '1', 10);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        idNumber: '',
        gender: 'male',
        acceptedTerms: false,
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
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                const msg = data?.error?.message || 'Something went wrong. Please try again.';
                if (data?.error?.code === 'DUPLICATE') {
                    setSubmitError(`An entry with this email already exists. Your raffle code may be: ${data?.error?.existingId || 'check your email'}.`);
                } else {
                    setSubmitError(msg);
                }
                return;
            }
            navigate(`/raffle/payment/${data.ticketId}`, { state: { ...formData } });
        } catch (err) {
            setSubmitError('A network error occurred. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (step < 1 || step > 2) return <Navigate to="/raffle/step/1" replace />;

    const progressPercent = ((step - 1) / (STEPS.length - 1)) * 100;

    return (
        <Layout maxWidth="max-w-5xl">
            {/* Progress Bar */}
            <div className="flex flex-col gap-3 pb-8 w-full">
                <div className="flex gap-6 justify-between items-center">
                    <p className="text-text-light dark:text-text-dark text-base font-bold uppercase tracking-wide">
                        {step === 1 ? 'YOUR DETAILS' : 'CONFIRM'}
                    </p>
                    <span className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium">
                        {Math.round(progressPercent)}% COMPLETE
                    </span>
                </div>
                <div className="w-full h-2.5 bg-border-light dark:bg-border-dark rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-500 ease-out"
                        style={{ width: step === 1 ? '0%' : '100%' }}
                    />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider pt-2 px-1">
                    {STEPS.map((label, idx) => {
                        const s = idx + 1;
                        const isCurrent = s === step;
                        const isDone = s < step;
                        return (
                            <span
                                key={label}
                                className={`transition-all ${isCurrent ? 'text-amber-500' : isDone ? 'text-text-light dark:text-text-dark' : 'text-text-muted-light dark:text-text-muted-dark'}`}
                            >
                                {label}
                            </span>
                        );
                    })}
                </div>
            </div>

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
