export interface TeamMember {
    img: string         // member profile image in `static/` location
    name: string        // name of the team-member
    position: string    // position within the society
}

export const team_members_data: Array<TeamMember> = [
    {
        img: './assets/img/comittee/miguel-photo.png',
        name: 'Miguel Bacharov',
        position: 'President'
    },
    {
        img: './assets/img/comittee/tomas-photo.png',
        name: 'Tomas Zaluckij',
        position: 'Secretary'
    },
    {
        img: './assets/img/comittee/alex-photo.png',
        name: 'Alexander Ajebon',
        position: 'Wellbeing Officer'
    },
    {
        img: './assets/img/comittee/lee-photo.png',
        name: 'Lee Beaver',
        position: 'Treasurer'
    },
]