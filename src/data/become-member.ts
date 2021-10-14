/**
 * INTERFACE for the
 * Indiviual Partner
*/
export interface MemberPerk {
    coverImg: string                // member perk image in `static/` location;
    title: string                   // member perk title;
    description: string             // member perk description;
}

/**
 * ..........
 * Contains the data for the ENUCS
 * Partners Objects;
*/
export const enucs_member_perks: Array<MemberPerk> = [
    // ..........
    // DISCROD UNIQUE MEMBERS ROLE;
    {
        coverImg: './assets/svg/become-member-enucs-discrod-frame.svg',
        title: 'Discrod Members Role',
        description: `
            <p class='s-12 bold color-secondary'> Exclusive membership role on our Discord Server </p>
            <p class='s-12 bold color-primary'> Obtain a unique members badge </p>
            <p class='s-12 bold color-secondary'> Members-lounge #channel access </p>
            <p class='s-12 bold color-primary'> Take vote in the committee’s decisions </p>
        `
    },
    // ..........
    // JOB OPPORTUNITIES VIEW ACCESS;
    {
        coverImg: './assets/svg/become-member-job-opportunities-frame.svg',
        title: 'Discrod Members Role',
        description: `
            <p class='s-12 bold color-secondary'> Job opportunities #channel access on Discord & Email </p>
            
        `
    },
    // ..........
    // SOCIETY FREEBIES;
    {
        coverImg: './assets/svg/become-member-freebies-frame.svg',
        title: 'Discrod Members Role',
        description: `
            <p class='s-12 bold color-secondary'> Surprise freebies up-for-grabs for members on our exlusive members events and at the university. </p>
        `
    },
    // ..........
    // REVOLUTION DISCOUNT CODE ACCESS;
    {
        coverImg: './assets/svg/become-member-revolution-discount-frame.svg',
        title: 'Discrod Members Role',
        description: `
            <p class='s-12 bold color-secondary'> Obtain a unique code to our go-to social events bar - Revolution for up to 40% on their menu. </p>
        `
    }
]