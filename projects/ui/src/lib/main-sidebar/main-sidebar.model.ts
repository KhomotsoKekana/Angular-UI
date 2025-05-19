export interface MainSidebarItem {
    title: string,
    url: string,
    icon: string,
    isActive: boolean,
    allowMobile: boolean,
    position?:string,
    hidden?: boolean,
    badge?: number
}