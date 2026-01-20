import { useState } from 'react';
import Layout from './components/Layout';
import ProgressBar from './components/ProgressBar';
import Step1ParticipationCategory from './components/Step1ParticipationCategory';
import Step2ChooseCircuit from './components/Step2ChooseCircuit';
import Step3RegistrationType from './components/Step3RegistrationType';
import Step4RiderDetails from './components/Step4RiderDetails';
import Step4TeamDetails from './components/Step4TeamDetails';
import FamilyRegistrationFlow from './components/FamilyRegistrationFlow';
import Step5Review from './components/Step5Review';
import type { RiderDetails, TeamDetails, FamilyDetails, ParticipationCategory } from './types';

const App = () => {
  const [step, setStep] = useState(1);
  const [participationCategory, setParticipationCategory] = useState<ParticipationCategory>('civilian');
  const [selectedCircuit, setSelectedCircuit] = useState('blitz');
  const [registrationType, setRegistrationType] = useState('individual');

  // Registration Data State
  const [riderDetails, setRiderDetails] = useState<RiderDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    idNumber: '',
    dob: '',
    gender: ''
  });

  const [teamDetails, setTeamDetails] = useState<TeamDetails>({
    teamName: '',
    members: [{
      id: '1',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      idNumber: '',
      dob: '',
      gender: '',
      isCaptain: true
    }]
  });

  const [familyDetails, setFamilyDetails] = useState<FamilyDetails>({
    guardian: { fullName: '', emergencyPhone: '', email: '', relationship: '' },
    riders: { cubs: [], champs: [], tigers: [] }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 5;

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (step === 4) {
      if (registrationType === 'individual') {
        if (!riderDetails.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!riderDetails.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!riderDetails.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(riderDetails.email)) newErrors.email = 'Invalid email address';
        if (!riderDetails.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
        if (!riderDetails.idNumber.trim()) newErrors.idNumber = 'ID/Passport is required';
        if (!riderDetails.dob) newErrors.dob = 'Date of birth is required';
        if (!riderDetails.gender) newErrors.gender = 'Gender is required';
      }
      else if (registrationType === 'team') {
        if (!teamDetails.teamName.trim()) newErrors.teamName = 'Team name is required';

        teamDetails.members.forEach((member) => {
          if (!member.firstName.trim()) newErrors[`${member.id}.firstName`] = 'Required';
          if (!member.lastName.trim()) newErrors[`${member.id}.lastName`] = 'Required';
          if (!member.email.trim()) newErrors[`${member.id}.email`] = 'Required';
          else if (!/\S+@\S+\.\S+/.test(member.email)) newErrors[`${member.id}.email`] = 'Invalid email';
          if (!member.phoneNumber.trim()) newErrors[`${member.id}.phoneNumber`] = 'Required';
          if (!member.idNumber.trim()) newErrors[`${member.id}.idNumber`] = 'Required';
          if (!member.dob) newErrors[`${member.id}.dob`] = 'Required';
          if (!member.gender) newErrors[`${member.id}.gender`] = 'Required';
        });

        if (teamDetails.members.length < 2) {
          // General error or alert? User just said "check height for delete button". Maybe standard is 2.
          // I'll leave min members check soft or just require fields for existing members.
          // If validation says "all fields mandatory", checking existing members is enough.
        }
      }
      else if (registrationType === 'family') {
        if (!familyDetails.guardian.fullName.trim()) newErrors['guardian.fullName'] = 'Guardian name is required';
        if (!familyDetails.guardian.email.trim()) newErrors['guardian.email'] = 'Guardian email is required';
        else if (!/\S+@\S+\.\S+/.test(familyDetails.guardian.email)) newErrors['guardian.email'] = 'Invalid email';
        if (!familyDetails.guardian.emergencyPhone.trim()) newErrors['guardian.emergencyPhone'] = 'Emergency phone is required';
        if (!familyDetails.guardian.relationship) newErrors['guardian.relationship'] = 'Relationship is required';

        // Check if at least one rider exists?
        const totalRiders = Object.values(familyDetails.riders).flat().length;
        if (totalRiders === 0) {
          // Maybe show a global error or just rely on adding riders?
          // Since "Add Rider" adds empty fields, we validate those.
        }

        Object.values(familyDetails.riders).forEach((riders) => {
          riders.forEach(rider => {
            if (!rider.firstName.trim()) newErrors[`${rider.id}.firstName`] = 'Required';
            if (!rider.lastName.trim()) newErrors[`${rider.id}.lastName`] = 'Required';
            if (!rider.dob) newErrors[`${rider.id}.dob`] = 'Required';
            if (!rider.gender) newErrors[`${rider.id}.gender`] = 'Required';
          });
        });
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;

      // Optional: Scrol to top or first error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrors({});
    }

    return isValid;
  };

  const handleNext = () => {
    // Step 1: Always go to next step (Circuit Selection)
    if (step === 1) {
      setStep(step + 1);
      return;
    }

    // Step 2: Circuit Selection
    if (step === 2) {
      if (selectedCircuit === 'family') {
        setRegistrationType('family');
        setStep(4); // Jump straight to family details (skipping Reg Type)
        return;
      }
      // For other circuits, go to Registration Type step
      setStep(step + 1);
      return;
    }

    // Step 3: Registration Type (for non-family circuits)
    if (step === 3) {
      if (!validateStep()) return; // Though Step 3 usually just selects type, if validation is needed it goes here

      // If user chose Team, go to Team Details. Individual goes to Rider Details.
      // Actually step increment handles this as Step 4 renders based on type.
      setStep(step + 1);
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    // Special case: Back from Step 4 (Family Details) goes to Step 2 (Circuit Selection)
    if (step === 4 && registrationType === 'family') {
      setStep(2);
      return;
    }

    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    alert('Registration submitted successfully!');
    console.log('Final Data:', { selectedCircuit, registrationType, riderDetails, teamDetails, familyDetails });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1ParticipationCategory
            selectedCategory={participationCategory}
            onSelect={(id) => setParticipationCategory(id as ParticipationCategory)}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <Step2ChooseCircuit
            selectedCircuit={selectedCircuit}
            onSelect={setSelectedCircuit}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <Step3RegistrationType
            selectedCircuit={selectedCircuit}
            selectedType={registrationType}
            onSelect={setRegistrationType}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        if (registrationType === 'individual') {
          return (
            <Step4RiderDetails
              data={riderDetails}
              onChange={setRiderDetails}
              onNext={handleNext}
              onBack={handleBack}
              errors={errors}
            />
          );
        } else if (registrationType === 'family') {
          return (
            <FamilyRegistrationFlow
              data={familyDetails}
              onChange={setFamilyDetails}
              onNext={handleNext}
              onBack={handleBack}
              errors={errors}
            />
          );
        } else {
          return (
            <Step4TeamDetails
              data={teamDetails}
              onChange={setTeamDetails}
              onNext={handleNext}
              onBack={handleBack}
              errors={errors}
            />
          );
        }
      case 5:
        return (
          <Step5Review
            selectedCircuitId={selectedCircuit}
            registrationType={registrationType}
            riderData={riderDetails}
            teamData={teamDetails}
            familyData={familyDetails}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Step 1: Participation Request";
      case 2: return "Step 2: Choose Your Circuit";
      case 3: return "Step 3: Registration Type";
      case 4:
        if (registrationType === 'individual') return "Step 4: Rider Details";
        if (registrationType === 'family') return "Step 4: Registration Progress";
        return "Step 4: Build Your Squad";
      case 5: return "Step 5: Review Your Registration";
      default: return "";
    }
  };

  return (
    <Layout registrationType={registrationType}>
      <ProgressBar
        currentStep={step}
        totalSteps={totalSteps}
        stepTitle={getStepTitle()}
        onStepClick={setStep}
      />
      {renderStep()}
    </Layout>
  );
};

export default App;
