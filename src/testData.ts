import type { RiderDetails, TeamDetails, FamilyDetails } from './types';

export interface TestScenario {
    id: string;
    name: string;
    circuit: string;
    type: 'individual' | 'team' | 'family';
    data: {
        rider?: RiderDetails;
        team?: TeamDetails;
        family?: FamilyDetails;
    };
}

export const TEST_SCENARIOS: TestScenario[] = [
    {
        id: 'blitz-indiv',
        name: 'Blitz Individual (Male, 31)',
        circuit: 'blitz',
        type: 'individual',
        data: {
            rider: {
                firstName: 'John',
                lastName: 'Airborne',
                email: 'john.airborne@racing.com',
                phoneNumber: '0711222333',
                idNumber: '12345678',
                dob: '1995-01-01',
                gender: 'male'
            }
        }
    },
    {
        id: 'blitz-team',
        name: 'Blitz Team (5 Members, Mixed)',
        circuit: 'blitz',
        type: 'team',
        data: {
            team: {
                teamName: 'Blitz Warriors',
                members: [
                    { id: '1', firstName: 'Speed', lastName: 'Demon', email: 'vanguards@race.com', phoneNumber: '0722333444', idNumber: '22334455', dob: '2005-01-01', gender: 'male', isCaptain: true },
                    { id: '2', firstName: 'Sarah', lastName: 'Sprint', email: 'sarah@race.com', phoneNumber: '0733444555', idNumber: '33445566', dob: '2000-01-01', gender: 'female', isCaptain: false },
                    { id: '3', firstName: 'Mike', lastName: 'Mile', email: 'mike@race.com', phoneNumber: '0744555666', idNumber: '44556677', dob: '1990-01-01', gender: 'male', isCaptain: false },
                    { id: '4', firstName: 'Flash', lastName: 'Gordon', email: 'flash@race.com', phoneNumber: '0755666777', idNumber: '55667788', dob: '1985-01-01', gender: 'male', isCaptain: false },
                    { id: '5', firstName: 'Rocket', lastName: 'Man', email: 'rocket@race.com', phoneNumber: '0766777888', idNumber: '66778899', dob: '1980-01-01', gender: 'male', isCaptain: false }
                ]
            }
        }
    },
    {
        id: 'intermediate-team',
        name: 'Intermediate Team (5 Members, Mixed)',
        circuit: 'intermediate',
        type: 'team',
        data: {
            team: {
                teamName: 'Recon Rangers',
                members: [
                    { id: '1', firstName: 'Cliff', lastName: 'Hanger', email: 'cliff@recon.com', phoneNumber: '0711111111', idNumber: '11111111', dob: '1990-05-05', gender: 'male', isCaptain: true },
                    { id: '2', firstName: 'Lina', lastName: 'Ladies', email: 'lina@recon.com', phoneNumber: '0722222222', idNumber: '22222222', dob: '1995-10-10', gender: 'female', isCaptain: false },
                    { id: '3', firstName: 'Bob', lastName: 'Builder', email: 'bob@recon.com', phoneNumber: '0733333333', idNumber: '33333333', dob: '1988-12-12', gender: 'male', isCaptain: false },
                    { id: '4', firstName: 'Trail', lastName: 'Blazer', email: 'trail@recon.com', phoneNumber: '0744444444', idNumber: '44444444', dob: '1992-02-02', gender: 'male', isCaptain: false },
                    { id: '5', firstName: 'Mud', lastName: 'Master', email: 'mud@recon.com', phoneNumber: '0755555555', idNumber: '55555555', dob: '1985-03-03', gender: 'male', isCaptain: false }
                ]
            }
        }
    },
    {
        id: 'corporate-team',
        name: 'Corporate Team (3 Members)',
        circuit: 'corporate',
        type: 'team',
        data: {
            team: {
                teamName: 'Executive Riders',
                members: [
                    { id: '1', firstName: 'CEO', lastName: 'Swift', email: 'ceo@corp.com', phoneNumber: '0700000001', idNumber: '10000001', dob: '1975-01-01', gender: 'male', isCaptain: true },
                    { id: '2', firstName: 'HR', lastName: 'Healer', email: 'hr@corp.com', phoneNumber: '0700000002', idNumber: '10000002', dob: '1982-02-02', gender: 'female', isCaptain: false },
                    { id: '3', firstName: 'CFO', lastName: 'Cruncher', email: 'cfo@corp.com', phoneNumber: '0700000003', idNumber: '10000003', dob: '1980-03-03', gender: 'male', isCaptain: false }
                ]
            }
        }
    },
    {
        id: 'family-all',
        name: 'Family Unit (Cubs, Champs, Tigers)',
        circuit: 'family',
        type: 'family',
        data: {
            family: {
                guardian: {
                    firstName: 'Super',
                    lastName: 'Mom',
                    fullName: 'Super Mom',
                    emergencyPhone: '0799888777',
                    email: 'mom@home.com',
                    relationship: 'Mother',
                    dob: '1985-01-01',
                    participation: 'none'
                },
                riders: {
                    cubs: [{ id: 'c1', firstName: 'Baby', lastName: 'Biker', dob: '2018-05-05', gender: 'male' }],
                    champs: [{ id: 'ch1', firstName: 'Kid', lastName: 'Rider', dob: '2014-06-06', gender: 'female' }],
                    tigers: [{ id: 't1', firstName: 'Iron', lastName: 'Lady', dob: '1985-07-07', gender: 'female' }]
                }
            }
        }
    }
];
