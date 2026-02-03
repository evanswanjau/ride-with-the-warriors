import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';
import Step2ChooseCircuit from '../components/Step2ChooseCircuit';
import Step3RegistrationType from '../components/Step3RegistrationType';
import Step4RiderDetails from '../components/Step4RiderDetails';
import Step4TeamDetails from '../components/Step4TeamDetails';
import FamilyRegistrationFlow from '../components/FamilyRegistrationFlow';
import Step5Review from '../components/Step5Review';

const RegisterPage = () => {
    const { stepId } = useParams();
    const step = parseInt(stepId || '1', 10);
    const navigate = useNavigate();

    const {
        selectedCircuit, setSelectedCircuit,
        registrationType, setRegistrationType,
        riderDetails, setRiderDetails,
        teamDetails, setTeamDetails,
        familyDetails, setFamilyDetails,
        errors, formErrors,
        isSubmitting,
        registrationId,
        pricingCategories,
        serverClassifications,
        handleNext, handleBack, handleSubmit
    } = useRegistration();

    const getStepTitle = () => {
        switch (step) {
            case 1: return "Choose Your Circuit";
            case 2: return "Registration Type";
            case 3:
                if (registrationType === 'individual') return "Rider Details";
                if (registrationType === 'family') return "Parent Details";
                return "Team Details";
            case 4: return "Review Registration";
            default: return "";
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step2ChooseCircuit selectedCircuit={selectedCircuit} onSelect={setSelectedCircuit} onNext={() => handleNext(1)} />;
            case 2:
                if (!selectedCircuit) return <Navigate to="/register/step/1" replace />;
                return <Step3RegistrationType selectedCircuit={selectedCircuit} selectedType={registrationType} onSelect={setRegistrationType} onNext={() => handleNext(2)} onBack={() => handleBack(2)} />;
            case 3:
                if (!selectedCircuit) return <Navigate to="/register/step/1" replace />;
                if (registrationType === 'individual') return <Step4RiderDetails data={riderDetails} onChange={setRiderDetails} onNext={() => handleNext(3)} onBack={() => handleBack(3)} errors={errors} formErrors={formErrors} isSubmitting={isSubmitting} />;
                if (registrationType === 'family') return <FamilyRegistrationFlow data={familyDetails} onChange={setFamilyDetails} onNext={() => handleNext(3)} onBack={() => handleBack(3)} errors={errors} formErrors={formErrors} isSubmitting={isSubmitting} />;
                return <Step4TeamDetails data={teamDetails} onChange={setTeamDetails} onNext={() => handleNext(3)} onBack={() => handleBack(3)} errors={errors} formErrors={formErrors} isSubmitting={isSubmitting} />;
            case 4:
                if (!selectedCircuit) return <Navigate to="/register/step/1" replace />;
                return (
                    <Step5Review
                        selectedCircuitId={selectedCircuit}
                        registrationType={registrationType}
                        riderData={riderDetails}
                        teamData={teamDetails}
                        familyData={familyDetails}
                        pricingCategories={pricingCategories}
                        serverClassifications={serverClassifications}
                        onBack={() => handleBack(4)}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        registrationId={registrationId}
                    />
                );
            default:
                return <Navigate to="/register/step/1" replace />;
        }
    };

    return (
        <Layout registrationType={registrationType}>
            <ProgressBar currentStep={step} totalSteps={4} stepTitle={getStepTitle()} onStepClick={(s: number) => navigate(`/register/step/${s}`)} />
            {renderStep()}
        </Layout>
    );
};

export default RegisterPage;
