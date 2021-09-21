/**
 * INTERFACE for the
 * Indiviual Partner
*/
export interface Partner {
    img: string                 // partner profile image in `static/` location
    name: string                // partner name
    partner_CTA_link: string    // partner link-to-action CTA
}

/**
 * Contains the data for the ENUCS
 * Partners Objects;
*/
export const enucs_partners_data: Array<Partner> = [
    {
        img: './assets/img/partners/encode-img.png',
        name: 'encode-club',
        partner_CTA_link: 'https://www.encode.club/'
    },
    {
        img: './assets/img/partners/revolution-img.png',
        name: 'revolution-bar',
        partner_CTA_link: 'https://www.revolution-bars.co.uk/'
    },
]