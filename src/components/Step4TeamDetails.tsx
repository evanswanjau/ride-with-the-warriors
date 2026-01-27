import type { TeamDetails, TeamMember } from '../types';
import ErrorBanner from './ErrorBanner';
import { calculateAge } from '../utils';


interface Step4TeamDetailsProps {
    data: TeamDetails;
    onChange: (data: TeamDetails) => void;
    onNext: () => void;
    onBack: () => void;
    errors: Record<string, string>;
    formErrors: string[];
    isSubmitting: boolean;
}

const Step4TeamDetails = ({ data, onChange, onNext, onBack, errors, formErrors, isSubmitting }: Step4TeamDetailsProps) => {
    const updateMember = (id: string, field: keyof TeamMember, value: any) => {
        const newMembers = data.members.map(m =>
            m.id === id ? { ...m, [field]: value } : m
        );
        onChange({ ...data, members: newMembers });
    };

    const addMember = () => {
        if (data.members.length >= 6) return;
        const newMember: TeamMember = {
            id: Math.random().toString(36).substr(2, 9),
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            idNumber: '',
            dob: '',
            gender: '',
            isCaptain: false
        };
        onChange({ ...data, members: [...data.members, newMember] });
    };

    const removeMember = (id: string) => {
        if (data.members.length <= 1) return;
        onChange({ ...data, members: data.members.filter(m => m.id !== id) });
    };

    return (
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1 w-full gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-text-light dark:text-white tracking-tight text-[32px] md:text-4xl font-bold leading-tight">Build Your Squad</h1>
                <p className="text-text-muted-light dark:text-gray-400 text-base font-normal leading-normal max-w-2xl">
                    Enter your team details and add your fellow warriors. Minimum 2 members required.
                </p>
            </div>

            <ErrorBanner errors={formErrors} />


            <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 gap-6 p-6 bg-white dark:bg-[#2a2418] rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-800">
                    <label className="flex flex-col gap-2">
                        <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                            Team Name <span className="text-red-500">*</span>
                        </span>
                        <div className="relative">
                            <input
                                className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors.teamName
                                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                    : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                    }`}
                                placeholder="e.g. Thunder Bolts"
                                type="text"
                                value={data.teamName}
                                onChange={(e) => onChange({ ...data, teamName: e.target.value })}
                            />
                        </div>
                        {errors.teamName && <span className="text-red-500 text-xs font-medium">{errors.teamName}</span>}
                    </label>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-text-light dark:text-white">Team Roster</h3>
                        <span className="text-sm font-medium text-text-muted-light bg-background-light dark:bg-neutral-800 px-3 py-1 rounded-full border border-border-light dark:border-neutral-700">
                            {data.members.length} / 5 Members
                        </span>
                    </div>

                    {data.members.map((member, index) => (
                        <div key={member.id} className="group relative bg-white dark:bg-[#2a2418] rounded-3xl hover:shadow-2xl border border-neutral-100 dark:border-neutral-800 transition-all duration-300 overflow-visible">
                            <div className="flex items-center justify-between p-6 border-b border-border-light dark:border-neutral-800">
                                <div className="flex items-center gap-4">
                                    <div className={`size-10 rounded-full flex items-center justify-center ${member.isCaptain ? 'bg-primary/10 text-primary' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500'}`}>
                                        <span className="material-symbols-outlined">{member.isCaptain ? 'stars' : 'person'}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-text-light dark:text-white text-lg font-bold">
                                            {member.isCaptain ? 'Team Captain' : `Member #${index + 1}`}
                                        </h3>
                                        <p className="text-xs text-text-muted-light dark:text-gray-400 font-medium uppercase tracking-wider">
                                            {member.isCaptain ? 'Primary Contact' : 'Rider'}
                                        </p>
                                    </div>
                                </div>
                                {!member.isCaptain && (
                                    <button
                                        onClick={() => removeMember(member.id)}
                                        className="size-10 rounded-full flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                        title="Remove Member"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>
                                )}
                            </div>

                            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                <label className="flex flex-col gap-2">
                                    <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                        First Name <span className="text-red-500">*</span>
                                    </span>
                                    <input
                                        className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors[`${member.id}.firstName`]
                                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                            : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                            }`}
                                        placeholder="Jane"
                                        type="text"
                                        value={member.firstName}
                                        onChange={(e) => updateMember(member.id, 'firstName', e.target.value)}
                                    />
                                    {errors[`${member.id}.firstName`] && <span className="text-red-500 text-xs font-medium">{errors[`${member.id}.firstName`]}</span>}
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                        Last Name <span className="text-red-500">*</span>
                                    </span>
                                    <input
                                        className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors[`${member.id}.lastName`]
                                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                            : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                            }`}
                                        placeholder="Doe"
                                        type="text"
                                        value={member.lastName}
                                        onChange={(e) => updateMember(member.id, 'lastName', e.target.value)}
                                    />
                                    {errors[`${member.id}.lastName`] && <span className="text-red-500 text-xs font-medium">{errors[`${member.id}.lastName`]}</span>}
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                        Email Address <span className="text-red-500">*</span>
                                    </span>
                                    <input
                                        className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors[`${member.id}.email`]
                                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                            : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                            }`}
                                        placeholder="jane.doe@example.com"
                                        type="email"
                                        value={member.email}
                                        onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                                    />
                                    {errors[`${member.id}.email`] && <span className="text-red-500 text-xs font-medium">{errors[`${member.id}.email`]}</span>}
                                </label>

                                <label className="flex flex-col gap-2">
                                    <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                        Phone Number <span className="text-red-500">*</span>
                                    </span>
                                    <input
                                        className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors[`${member.id}.phoneNumber`]
                                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                            : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                            }`}
                                        placeholder="0712 345 678"
                                        type="tel"
                                        value={member.phoneNumber}
                                        onChange={(e) => updateMember(member.id, 'phoneNumber', e.target.value)}
                                    />
                                    {errors[`${member.id}.phoneNumber`] && <span className="text-red-500 text-xs font-medium">{errors[`${member.id}.phoneNumber`]}</span>}
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                        National ID / Passport <span className="text-red-500">*</span>
                                    </span>
                                    <input
                                        className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors[`${member.id}.idNumber`]
                                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                            : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                            }`}
                                        placeholder="12345678"
                                        type="text"
                                        value={member.idNumber}
                                        onChange={(e) => updateMember(member.id, 'idNumber', e.target.value)}
                                    />
                                    {errors[`${member.id}.idNumber`] && <span className="text-red-500 text-xs font-medium">{errors[`${member.id}.idNumber`]}</span>}
                                </label>
                                <label className="flex flex-col gap-2">
                                    <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider flex items-center justify-between">
                                        <span>Date of Birth <span className="text-red-500">*</span></span>
                                        {member.dob && (
                                            <span className="text-primary normal-case font-bold bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
                                                {calculateAge(member.dob)} years old
                                            </span>
                                        )}
                                    </span>
                                    <input
                                        className={`w-full rounded-lg border bg-white dark:bg-gray-900 text-text-light dark:text-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 ${errors[`${member.id}.dob`]
                                            ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                            : 'border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary'
                                            }`}
                                        type="date"
                                        value={member.dob}
                                        onChange={(e) => updateMember(member.id, 'dob', e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                    {errors[`${member.id}.dob`] && <span className="text-red-500 text-xs font-medium">{errors[`${member.id}.dob`]}</span>}
                                </label>
                                <div className="flex flex-col gap-2">
                                    <span className="text-text-light dark:text-text-dark text-[10px] font-semibold uppercase tracking-wider">
                                        Gender <span className="text-red-500">*</span>
                                    </span>
                                    <div className="flex gap-6 items-center h-[42px] px-1">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    className="peer sr-only"
                                                    name={`gender_${member.id}`}
                                                    type="radio"
                                                    value="male"
                                                    checked={member.gender === 'male'}
                                                    onChange={() => updateMember(member.id, 'gender', 'male')}
                                                />
                                                <div className={`size-5 rounded-full border transition-all ${member.gender === 'male' ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600 bg-transparent group-hover:border-primary'}`}></div>
                                                <div className="absolute size-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                            </div>
                                            <span className={`text-sm font-medium transition-colors ${member.gender === 'male' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>Male</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    className="peer sr-only"
                                                    name={`gender_${member.id}`}
                                                    type="radio"
                                                    value="female"
                                                    checked={member.gender === 'female'}
                                                    onChange={() => updateMember(member.id, 'gender', 'female')}
                                                />
                                                <div className={`size-5 rounded-full border transition-all ${member.gender === 'female' ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600 bg-transparent group-hover:border-primary'}`}></div>
                                                <div className="absolute size-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                            </div>
                                            <span className={`text-sm font-medium transition-colors ${member.gender === 'female' ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>Female</span>
                                        </label>
                                    </div>
                                    {errors[`${member.id}.gender`] && <span className="text-red-500 text-xs font-medium">{errors[`${member.id}.gender`]}</span>}
                                </div>
                            </div>
                        </div>
                    ))}

                    {data.members.length < 5 && (
                        <button
                            onClick={addMember}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-light dark:border-neutral-700 bg-background-light dark:bg-transparent p-6 text-sm font-bold text-text-muted-light transition-all hover:bg-white dark:hover:bg-neutral-800 hover:border-primary hover:text-primary"
                            type="button"
                        >
                            <span className="material-symbols-outlined">add_circle</span>
                            <span>Add Team Member</span>
                        </button>
                    )}
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-[#e6e0d4] dark:border-[#2d332d]">
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center h-12 px-6 rounded-lg text-gray-500 hover:text-[#1c170d] dark:text-gray-400 dark:hover:text-white font-bold transition-colors cursor-pointer"
                        type="button"
                        disabled={isSubmitting}
                    >
                        <span className="material-symbols-outlined mr-2 text-sm">arrow_back</span>
                        Back
                    </button>
                    <button
                        onClick={onNext}
                        className="flex min-w-[200px] items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-primary hover:bg-green-600 active:bg-green-700 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-green-500/20 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        type="button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-3">
                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Saving Draft...</span>
                            </div>
                        ) : (
                            <>
                                <span className="truncate">Continue</span>
                                <span className="material-symbols-outlined ml-2 text-xl">arrow_forward</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Step4TeamDetails;
