import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import ProgressBar from './components/ProgressBar';
import Step2ChooseCircuit from './components/Step2ChooseCircuit';
import Step3RegistrationType from './components/Step3RegistrationType';
import Step4RiderDetails from './components/Step4RiderDetails';
import Step4TeamDetails from './components/Step4TeamDetails';
import FamilyRegistrationFlow from './components/FamilyRegistrationFlow';
import Step5Review from './components/Step5Review';
import ProfileLookup from './components/ProfileLookup';
import ProfileView from './components/ProfileView';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import PaymentPage from './components/PaymentPage';
import SuccessPage from './components/SuccessPage';
import Gallery from './components/Gallery';
import Rules from './components/Rules';
import type { RiderDetails, TeamDetails, FamilyDetails } from './types';
import { isValidKenyanPhone, isValidID, calculateAge } from './utils';
import { TEST_SCENARIOS, type TestScenario } from './testData';
import { API_BASE_URL } from './config';

const App = () => {
  const navigate = useNavigate();

  const [selectedCircuit, setSelectedCircuit] = useState('');
  const [registrationType, setRegistrationType] = useState('individual');
  const [showDevTools, setShowDevTools] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [adminUser, setAdminUser] = useState<any>(JSON.parse(localStorage.getItem('adminUser') || 'null'));
  const [foundRegistration, setFoundRegistration] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  const handleAdminLogin = (token: string, admin: any) => {
    setAdminToken(token);
    setAdminUser(admin);
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(admin));
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

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
    guardian: { firstName: '', lastName: '', fullName: '', emergencyPhone: '', email: '', relationship: '', participation: 'none', dob: '' },
    riders: { cubs: [], champs: [], tigers: [] }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const loadScenario = (scenario: TestScenario) => {
    setSelectedCircuit(scenario.circuit);
    setRegistrationType(scenario.type);
    if (scenario.data.rider) setRiderDetails(scenario.data.rider);
    if (scenario.data.team) setTeamDetails(scenario.data.team);
    if (scenario.data.family) setFamilyDetails(scenario.data.family);

    setErrors({});
    setFormErrors([]);
    navigate('/register/step/4');
    setShowDevTools(false);
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    const newFormErrors: string[] = [];
    let isValid = true;

    if (step === 3) {
      if (registrationType === 'individual') {
        if (!riderDetails.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!riderDetails.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!riderDetails.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(riderDetails.email)) newErrors.email = 'Invalid email address';
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
      }
      else if (registrationType === 'team') {
        if (!teamDetails.teamName.trim()) newErrors.teamName = 'Team name is required';

        teamDetails.members.forEach((member) => {
          if (!member.firstName.trim()) newErrors[`${member.id}.firstName`] = 'Required';
          if (!member.lastName.trim()) newErrors[`${member.id}.lastName`] = 'Required';
          if (!member.email.trim()) newErrors[`${member.id}.email`] = 'Required';
          else if (!/\S+@\S+\.\S+/.test(member.email)) newErrors[`${member.id}.email`] = 'Invalid email';
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
        });

        const numMembers = teamDetails.members.length;
        const numFemales = teamDetails.members.filter(m => m.gender === 'female').length;

        if (selectedCircuit === 'corporate') {
          if (numMembers < 3 || numMembers > 5) {
            newFormErrors.push(`Corporate teams must have 3-5 members (Currently: ${numMembers})`);
          }
        } else if (selectedCircuit === 'blitz' || selectedCircuit === 'intermediate') {
          if (numMembers < 5) {
            newFormErrors.push(`Competitive teams (120/60KM) must have at least 5 members (Currently: ${numMembers})`);
          } else if (numFemales < 1) {
            newFormErrors.push('Competitive teams must have at least one female rider');
          }
        }
      }
      else if (registrationType === 'family') {
        if (!familyDetails.guardian.firstName.trim()) newErrors['guardian.firstName'] = 'First name is required';
        if (!familyDetails.guardian.lastName.trim()) newErrors['guardian.lastName'] = 'Last name is required';
        if (!familyDetails.guardian.email.trim()) newErrors['guardian.email'] = 'Guardian email is required';
        else if (!/\S+@\S+\.\S+/.test(familyDetails.guardian.email)) newErrors['guardian.email'] = 'Invalid email';
        if (!familyDetails.guardian.emergencyPhone.trim()) newErrors['guardian.emergencyPhone'] = 'Emergency phone is required';
        else if (!isValidKenyanPhone(familyDetails.guardian.emergencyPhone)) newErrors['guardian.emergencyPhone'] = 'Invalid Kenyan number';
        if (!familyDetails.guardian.relationship) newErrors['guardian.relationship'] = 'Relationship is required';
        if (!familyDetails.guardian.participation) newErrors['guardian.participation'] = 'Required';

        if (familyDetails.guardian.participation === 'mom') {
          if (!familyDetails.guardian.dob) newErrors['guardian.dob'] = 'Required';
          else {
            const age = calculateAge(familyDetails.guardian.dob);
            if (new Date(familyDetails.guardian.dob) > new Date()) newErrors['guardian.dob'] = 'Invalid';
            else if (age !== null && age < 18) {
              newErrors['guardian.dob'] = 'Moms must be 18+';
            }
          }
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
              else if (category === 'cubs' && (age < 4 || age > 8)) {
                newErrors[`${rider.id}.dob`] = 'Cubs must be 4-8 years old';
              } else if (category === 'champs' && (age < 9 || age > 13)) {
                newErrors[`${rider.id}.dob`] = 'Champs must be 9-13 years old';
              }
            }
            if (!rider.gender) newErrors[`${rider.id}.gender`] = 'Required';
          });
        });
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

      // SAVE DRAFT BEFORE PROCEEDING TO REVIEW
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
            registrationId // Pass existing ID if we are editing
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          if (data.error?.code === 'DUPLICATE' && data.error.details?.duplicates) {
            const newErrors: Record<string, string> = {};
            const duplicateEmails = data.error.details.duplicates as string[];

            // Map duplicate emails to the form fields
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
        if (!formErrors.length) setFormErrors(['Could not save draft. Please check your connection.']);
      } finally {
        setIsSubmitting(false);
      }
      return;
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
          registrationId,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Registration failed');

      navigate(`/payment/${data.registrationId}`, {
        state: {
          amount: data.pricing.totalAmount,
          email: registrationType === 'individual' ? riderDetails.email :
            registrationType === 'team' ? teamDetails.members[0].email :
              familyDetails.guardian.email
        }
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
    <Routes>
      <Route path="/" element={<Navigate to="/register/step/1" replace />} />

      {/* Registration Flow */}
      <Route path="/register/step/:stepId" element={
        <RegistrationFlow
          selectedCircuit={selectedCircuit}
          setSelectedCircuit={setSelectedCircuit}
          registrationType={registrationType}
          setRegistrationType={setRegistrationType}
          riderDetails={riderDetails}
          setRiderDetails={setRiderDetails}
          teamDetails={teamDetails}
          setTeamDetails={setTeamDetails}
          familyDetails={familyDetails}
          setFamilyDetails={setFamilyDetails}
          errors={errors}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          registrationId={registrationId}
          handleNext={handleNext}
          handleBack={handleBack}
          handleSubmit={handleSubmit}
          loadScenario={loadScenario}
          showDevTools={showDevTools}
          setShowDevTools={setShowDevTools}
        />
      } />

      {/* Payment & Success */}
      <Route path="/payment/:regId" element={<PaymentRoute />} />
      <Route path="/success/:regId" element={<SuccessRoute setFoundRegistration={setFoundRegistration} />} />

      {/* Profile & Search */}
      <Route path="/search" element={<Layout><ProfileLookup onFound={(reg) => setFoundRegistration(reg)} /></Layout>} />
      <Route path="/profile/:id" element={<Layout><ProfileRoute foundRegistration={foundRegistration} setFoundRegistration={setFoundRegistration} /></Layout>} />

      {/* Info Pages */}
      <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
      <Route path="/rules" element={<Layout><Rules /></Layout>} />

      {/* Admin */}
      <Route path="/admin" element={
        !adminToken ? (
          <AdminLogin onLogin={handleAdminLogin} onBack={() => navigate('/')} />
        ) : (
          <AdminDashboard token={adminToken} admin={adminUser} onLogout={handleAdminLogout} />
        )
      } />
    </Routes>
  );
};

// Sub-components for better organization
const RegistrationFlow = ({
  selectedCircuit, setSelectedCircuit,
  registrationType, setRegistrationType,
  riderDetails, setRiderDetails,
  teamDetails, setTeamDetails,
  familyDetails, setFamilyDetails,
  errors, formErrors,
  isSubmitting,
  registrationId,
  handleNext, handleBack, handleSubmit,
  loadScenario, showDevTools, setShowDevTools
}: any) => {
  const { stepId } = useParams();
  const step = parseInt(stepId || '1', 10);
  const navigate = useNavigate();

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Choose Your Circuit";
      case 2: return "Registration Type";
      case 3:
        if (registrationType === 'individual') return "Rider Details";
        if (registrationType === 'family') return "Family Details";
        return "Team Details";
      case 4: return "Review Registration";
      default: return "";
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step2ChooseCircuit selectedCircuit={selectedCircuit} onSelect={setSelectedCircuit} onNext={() => handleNext(1)} onBack={() => { }} />;
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
        return <Step5Review selectedCircuitId={selectedCircuit} registrationType={registrationType} riderData={riderDetails} teamData={teamDetails} familyData={familyDetails} onBack={() => handleBack(4)} onSubmit={handleSubmit} isSubmitting={isSubmitting} registrationId={registrationId} />;
      default:
        return <Navigate to="/register/step/1" replace />;
    }
  };

  return (
    <Layout registrationType={registrationType}>
      <ProgressBar currentStep={step} totalSteps={4} stepTitle={getStepTitle()} onStepClick={(s: number) => navigate(`/register/step/${s}`)} />
      {renderStep()}

      <div className="fixed top-6 right-6 z-[999]">
        <button onClick={() => setShowDevTools(!showDevTools)} className="size-10 rounded-full bg-neutral-900/50 backdrop-blur text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all border border-white/20">
          <span className="material-symbols-outlined text-sm">terminal</span>
        </button>

        {showDevTools && (
          <div className="absolute top-14 right-0 w-64 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-800 p-4 animate-in fade-in zoom-in duration-200 origin-top-right">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">Quick Test Scenarios</h4>
            <div className="flex flex-col gap-2">
              {TEST_SCENARIOS.map(s => (
                <button key={s.id} onClick={() => loadScenario(s)} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-all flex items-center justify-between group">
                  <span>{s.name}</span>
                  <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">bolt</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

const PaymentRoute = () => {
  const { regId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, email } = (location.state as any) || { amount: 0, email: '' };

  if (!regId) return <Navigate to="/" replace />;

  return (
    <PaymentPage
      registrationId={regId}
      amount={amount}
      email={email}
      onBack={() => navigate(-1)}
      onSuccess={() => navigate(`/success/${regId}`)}
    />
  );
};

const SuccessRoute = ({ setFoundRegistration }: any) => {
  const { regId } = useParams();
  const navigate = useNavigate();

  if (!regId) return <Navigate to="/" replace />;

  return (
    <SuccessPage
      registrationId={regId}
      onViewProfile={async () => {
        const response = await fetch(`${API_BASE_URL}/profile/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ searchType: 'id', searchValue: regId })
        });
        const data = await response.json();
        if (response.ok) {
          setFoundRegistration(data.registration);
          navigate(`/profile/${regId}`);
        }
      }}
      onDone={() => navigate('/')}
    />
  );
};

const ProfileRoute = ({ foundRegistration, setFoundRegistration }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!foundRegistration && id) {
      // Potentially fetch if missing
      fetch(`${API_BASE_URL}/profile/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchType: 'id', searchValue: id })
      })
        .then(res => res.json())
        .then(data => data.registration && setFoundRegistration(data.registration))
        .catch(console.error);
    }
  }, [id, foundRegistration, setFoundRegistration]);

  if (!foundRegistration) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  return (
    <ProfileView
      registration={foundRegistration}
      onBack={() => navigate('/search')}
    />
  );
};

export default App;
