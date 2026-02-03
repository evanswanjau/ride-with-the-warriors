import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RiderDetails, TeamDetails, FamilyDetails } from '../types';
import { isValidKenyanPhone, isValidID, calculateAge } from '../utils';
import { API_BASE_URL } from '../config';

interface RegistrationContextType {
    // State
    selectedCircuit: string;
    setSelectedCircuit: (val: string) => void;
    registrationType: string;
    setRegistrationType: (val: string) => void;
    riderDetails: RiderDetails;
    setRiderDetails: React.Dispatch<React.SetStateAction<RiderDetails>>;
    teamDetails: TeamDetails;
    setTeamDetails: React.Dispatch<React.SetStateAction<TeamDetails>>;
    familyDetails: FamilyDetails;
    setFamilyDetails: React.Dispatch<React.SetStateAction<FamilyDetails>>;
    errors: Record<string, string>;
    formErrors: string[];
    isSubmitting: boolean;
    registrationId: string | null;
    pricingCategories: any[];
    foundRegistration: any;
    setFoundRegistration: (val: any) => void;

    // Helpers/Handlers
    handleNext: (currentStep: number) => Promise<void>;
    handleBack: (currentStep: number) => void;
    handleSubmit: () => Promise<void>;
    validateStep: (step: number) => boolean;
    hasInProgressRegistration: boolean;
    setFormErrors: (errors: string[]) => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();

    // Basic State
    const [selectedCircuit, setSelectedCircuit] = useState('');
    const [registrationType, setRegistrationType] = useState('individual');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registrationId, setRegistrationId] = useState<string | null>(null);
    const [pricingCategories, setPricingCategories] = useState<any[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formErrors, setFormErrors] = useState<string[]>([]);

    // Registration Data State
    const [riderDetails, setRiderDetails] = useState<RiderDetails>({
        firstName: '', lastName: '', email: '', phoneNumber: '', idNumber: '', dob: '', gender: '', tshirtSize: '', emergencyContactName: '', emergencyPhone: ''
    });

    const [teamDetails, setTeamDetails] = useState<TeamDetails>({
        teamName: '',
        members: [{
            id: '1', firstName: '', lastName: '', email: '', phoneNumber: '', idNumber: '', dob: '', gender: '', tshirtSize: '', emergencyContactName: '', emergencyPhone: '', isCaptain: true
        }]
    });

    const [familyDetails, setFamilyDetails] = useState<FamilyDetails>({
        guardian: { firstName: '', lastName: '', fullName: '', emergencyPhone: '', email: '', relationship: '', participation: 'none', dob: '', emergencyContactName: '', tshirtSize: '' },
        riders: { cubs: [], champs: [], tigers: [] }
    });

    const hasInProgressRegistration =
        selectedCircuit !== '' ||
        (registrationType === 'individual' && riderDetails.firstName !== '') ||
        (registrationType === 'team' && teamDetails.teamName !== '') ||
        (registrationType === 'family' && familyDetails.guardian.firstName !== '');

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasInProgressRegistration) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasInProgressRegistration]);

    const [foundRegistration, setFoundRegistration] = useState<any>(null);

    // Fetch Pricing Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/registrations/config/categories`);
                if (!response.ok) throw new Error('Failed to fetch pricing categories');
                const data = await response.json();
                setPricingCategories(data.categories);
            } catch (err) {
                console.error('Error fetching pricing categories:', err);
            }
        };
        fetchCategories();
    }, []);

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};
        const newFormErrors: string[] = [];
        let isValid = true;

        if (step === 3) {
            if (registrationType === 'individual') {
                if (!riderDetails.firstName.trim()) newErrors.firstName = 'First name is required';
                if (!riderDetails.lastName.trim()) newErrors.lastName = 'Last name is required';
                if (!riderDetails.email.trim()) newErrors.email = 'Email is required';
                else if (!/\S+@\S+\.\S/.test(riderDetails.email)) newErrors.email = 'Invalid email address';
                if (!riderDetails.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
                else if (!isValidKenyanPhone(riderDetails.phoneNumber)) newErrors.phoneNumber = 'Invalid Kenyan phone number (e.g., 0712345678)';
                if (!riderDetails.idNumber.trim()) newErrors.idNumber = 'ID/Passport is required';
                else if (!isValidID(riderDetails.idNumber)) newErrors.idNumber = 'ID must be 8-10 digits only';
                if (!riderDetails.dob) newErrors.dob = 'Date of birth is required';
                else {
                    const age = calculateAge(riderDetails.dob);
                    if (new Date(riderDetails.dob) > new Date()) newErrors.dob = 'Date of birth cannot be in the future';
                    else if (selectedCircuit !== 'family' && age !== null && age < 13) {
                        newErrors.dob = 'Must be at least 13 years old for this circuit';
                    }
                }
                if (!riderDetails.gender) newErrors.gender = 'Gender is required';
                if (!riderDetails.tshirtSize) newErrors.tshirtSize = 'T-shirt size is required';
                if (!riderDetails.emergencyContactName?.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
                if (!riderDetails.emergencyPhone?.trim()) newErrors.emergencyPhone = 'Emergency phone is required';
                else if (!isValidKenyanPhone(riderDetails.emergencyPhone)) newErrors.emergencyPhone = 'Invalid Kenyan phone number';
            }
            else if (registrationType === 'team') {
                if (!teamDetails.teamName.trim()) newErrors.teamName = 'Team name is required';

                teamDetails.members.forEach((member) => {
                    if (!member.firstName.trim()) newErrors[`${member.id}.firstName`] = 'Required';
                    if (!member.lastName.trim()) newErrors[`${member.id}.lastName`] = 'Required';
                    if (!member.email.trim()) newErrors[`${member.id}.email`] = 'Required';
                    else if (!/\S+@\S+\.\S/.test(member.email)) newErrors[`${member.id}.email`] = 'Invalid email';
                    if (!member.phoneNumber.trim()) newErrors[`${member.id}.phoneNumber`] = 'Required';
                    else if (!isValidKenyanPhone(member.phoneNumber)) newErrors[`${member.id}.phoneNumber`] = 'Invalid';
                    if (!member.idNumber.trim()) newErrors[`${member.id}.idNumber`] = 'Required';
                    else if (!isValidID(member.idNumber)) newErrors[`${member.id}.idNumber`] = '8-10 digits only';
                    if (!member.dob) newErrors[`${member.id}.dob`] = 'Required';
                    else {
                        const age = calculateAge(member.dob);
                        if (new Date(member.dob) > new Date()) newErrors[`${member.id}.dob`] = 'Invalid';
                        else if (selectedCircuit !== 'family' && age !== null && age < 13) {
                            newErrors[`${member.id}.dob`] = 'Must be 13+';
                        }
                    }
                    if (!member.gender) newErrors[`${member.id}.gender`] = 'Required';
                    if (!member.tshirtSize) newErrors[`${member.id}.tshirtSize`] = 'Required';
                    if (!member.emergencyContactName?.trim()) newErrors[`${member.id}.emergencyContactName`] = 'Required';
                    if (!member.emergencyPhone?.trim()) newErrors[`${member.id}.emergencyPhone`] = 'Required';
                    else if (!isValidKenyanPhone(member.emergencyPhone)) newErrors[`${member.id}.emergencyPhone`] = 'Invalid';
                });

                const numMembers = teamDetails.members.length;
                if (selectedCircuit === 'corporate') {
                    if (numMembers < 3 || numMembers > 5) newFormErrors.push(`Corporate teams must have 3-5 members (Currently: ${numMembers})`);
                } else if (selectedCircuit === 'blitz' || selectedCircuit === 'recon') {
                    if (numMembers !== 5) newFormErrors.push(`Competitive teams (120/60KM) must have exactly 5 members (Currently: ${numMembers})`);
                }
            }
            else if (registrationType === 'family') {
                if (!familyDetails.guardian.firstName.trim()) newErrors['guardian.firstName'] = 'First name is required';
                if (!familyDetails.guardian.lastName.trim()) newErrors['guardian.lastName'] = 'Last name is required';
                if (!familyDetails.guardian.email.trim()) newErrors['guardian.email'] = 'Guardian email is required';
                else if (!/\S+@\S+\.\S/.test(familyDetails.guardian.email)) newErrors['guardian.email'] = 'Invalid email';
                if (!familyDetails.guardian.emergencyPhone.trim()) newErrors['guardian.emergencyPhone'] = 'Emergency phone is required';
                else if (!isValidKenyanPhone(familyDetails.guardian.emergencyPhone)) newErrors['guardian.emergencyPhone'] = 'Invalid Kenyan number';
                if (!familyDetails.guardian.relationship) newErrors['guardian.relationship'] = 'Relationship is required';
                if (!familyDetails.guardian.participation) newErrors['guardian.participation'] = 'Required';

                if (familyDetails.guardian.participation === 'mom') {
                    if (!familyDetails.guardian.dob) newErrors['guardian.dob'] = 'Required';
                    else {
                        const age = calculateAge(familyDetails.guardian.dob);
                        if (new Date(familyDetails.guardian.dob) > new Date()) newErrors['guardian.dob'] = 'Invalid';
                        else if (age !== null && age < 18) newErrors['guardian.dob'] = 'Parents must be 18+';
                    }
                    if (!familyDetails.guardian.tshirtSize) newErrors['guardian.tshirtSize'] = 'T-shirt size is required';
                }

                Object.entries(familyDetails.riders).forEach(([category, riders]) => {
                    riders.forEach(rider => {
                        if (!rider.firstName.trim()) newErrors[`${rider.id}.firstName`] = 'Required';
                        if (!rider.lastName.trim()) newErrors[`${rider.id}.lastName`] = 'Required';
                        if (!rider.dob) newErrors[`${rider.id}.dob`] = 'Required';
                        else {
                            const age = calculateAge(rider.dob);
                            if (new Date(rider.dob) > new Date()) newErrors[`${rider.id}.dob`] = 'Invalid';
                            else if (age === null) newErrors[`${rider.id}.dob`] = 'Invalid';
                            else if (category === 'cubs' && (age < 4 || age > 8)) newErrors[`${rider.id}.dob`] = 'Cubs must be 4-8 years old';
                            else if (category === 'champs' && (age < 9 || age > 13)) newErrors[`${rider.id}.dob`] = 'Champs must be 9-13 years old';
                        }
                        if (!rider.gender) newErrors[`${rider.id}.gender`] = 'Required';
                        if (!rider.tshirtSize) newErrors[`${rider.id}.tshirtSize`] = 'Required';
                    });
                });

                const totalChildren = familyDetails.riders.cubs.length + familyDetails.riders.champs.length;
                if (totalChildren === 0) newFormErrors.push('A family registration must include at least one child (Cub or Champ).');
            }
        }

        if (Object.keys(newErrors).length > 0 || newFormErrors.length > 0) {
            setErrors(newErrors);
            setFormErrors(newFormErrors);
            isValid = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setErrors({});
            setFormErrors([]);
        }

        return isValid;
    };

    const handleNext = async (currentStep: number) => {
        if (currentStep === 1) {
            if (selectedCircuit === 'family') {
                setRegistrationType('family');
                navigate('/register/step/3');
                return;
            }
            navigate('/register/step/2');
            return;
        }

        if (currentStep === 2) {
            navigate('/register/step/3');
            return;
        }

        if (currentStep === 3) {
            if (!validateStep(3)) return;

            setIsSubmitting(true);
            try {
                let payload: any;
                if (registrationType === 'individual') payload = { riderDetails };
                else if (registrationType === 'team') payload = { teamDetails };
                else payload = { familyDetails };

                const response = await fetch(`${API_BASE_URL}/registrations`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        circuitId: selectedCircuit,
                        type: registrationType,
                        payload,
                        ...(registrationId ? { registrationId } : {}),
                    }),
                });

                const data = await response.json();
                if (!response.ok) {
                    if (data.error?.code === 'DUPLICATE' && data.error.details?.duplicates) {
                        const newErrors: Record<string, string> = {};
                        const duplicateEmails = data.error.details.duplicates as string[];

                        if (registrationType === 'individual') {
                            if (duplicateEmails.includes(riderDetails.email)) newErrors.email = 'This email is already registered';
                        } else if (registrationType === 'team') {
                            teamDetails.members.forEach(m => {
                                if (duplicateEmails.includes(m.email)) newErrors[`${m.id}.email`] = 'Already registered';
                            });
                        } else if (registrationType === 'family') {
                            if (duplicateEmails.includes(familyDetails.guardian.email) && familyDetails.guardian.participation === 'mom') {
                                newErrors['guardian.email'] = 'Guardian already registered';
                            }
                        }

                        setErrors(newErrors);
                        setFormErrors(['One or more participants are already registered. Please check the highlighted emails.']);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        return;
                    }
                    throw new Error(data.error?.message || 'Failed to save draft');
                }

                setRegistrationId(data.registrationId);
                navigate('/register/step/4');
            } catch (error) {
                console.error('Draft save error:', error);
                setFormErrors(['Could not save draft. Please check your connection.']);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleBack = (currentStep: number) => {
        if (currentStep === 3) {
            if (selectedCircuit === 'family') {
                navigate('/register/step/1');
                return;
            }
            navigate('/register/step/2');
            return;
        }
        if (currentStep > 1) {
            navigate(`/register/step/${currentStep - 1}`);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setFormErrors([]);

        try {
            let payload: any;
            if (registrationType === 'individual') payload = { riderDetails };
            else if (registrationType === 'team') payload = { teamDetails };
            else payload = { familyDetails };

            const response = await fetch(`${API_BASE_URL}/registrations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    circuitId: selectedCircuit,
                    type: registrationType,
                    payload,
                    ...(registrationId ? { registrationId } : {}),
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || 'Registration failed');

            const nextAmount = data.pricing.totalAmount;
            const nextEmail = registrationType === 'individual' ? riderDetails.email :
                registrationType === 'team' ? teamDetails.members[0].email :
                    familyDetails.guardian.email;
            const nextRegId = data.registrationId;

            navigate(`/payment/${nextRegId}`, {
                state: { amount: nextAmount, email: nextEmail }
            });
        } catch (error) {
            console.error('Registration error:', error);
            setFormErrors([error instanceof Error ? error.message : 'An error occurred during registration']);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <RegistrationContext.Provider value={{
            selectedCircuit, setSelectedCircuit,
            registrationType, setRegistrationType,
            riderDetails, setRiderDetails,
            teamDetails, setTeamDetails,
            familyDetails, setFamilyDetails,
            errors, formErrors, setFormErrors,
            isSubmitting,
            registrationId,
            pricingCategories,
            foundRegistration, setFoundRegistration,
            handleNext, handleBack, handleSubmit, validateStep,
            hasInProgressRegistration
        }}>
            {children}
        </RegistrationContext.Provider>
    );
};

export const useRegistration = () => {
    const context = useContext(RegistrationContext);
    if (context === undefined) {
        throw new Error('useRegistration must be used within a RegistrationProvider');
    }
    return context;
};
