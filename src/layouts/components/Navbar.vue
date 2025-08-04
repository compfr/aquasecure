<template>
    <div class="navbar-container d-flex content align-items-center">

        <!-- Nav Menu Toggler -->
        <ul class="nav navbar-nav d-xl-none">
            <li class="nav-item">
                <b-link
                    class="nav-link"
                    @click="toggleVerticalMenuActive"
                >
                    <feather-icon
                        icon="MenuIcon"
                        size="21"
                    />
                </b-link>
            </li>
        </ul>

        <!-- Left Col -->
        <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">
            <dark-Toggler class="d-none d-lg-block"/>


        </div>

        <b-navbar-nav class="nav align-items-center ml-auto">

            <!--            <notification-dropdown/>-->
            <div id="google_translate_element"></div>
            <b-nav-item-dropdown
                right
                toggle-class="d-flex align-items-center dropdown-user-link"
                class="dropdown-user"
            >
                <template #button-content>
                    <div class="d-sm-flex d-none user-nav">
                        <p class="user-name font-weight-bolder mb-0">
                            {{ user_name }}
                        </p>
                        <span class="user-status">{{ user_roles.join(', ') }}</span>
                    </div>
                    <b-avatar
                        size="40"
                        variant="light-primary"
                        badge
                        :src="require('@/assets/images/avatars/13-small.png')"
                        class="badge-minimal"
                        badge-variant="success"
                    />
                </template>
                <template v-if="view_profile">
                    <b-dropdown-item @click="goToProfile" link-class="d-flex align-items-center">
                        <feather-icon
                            size="16"
                            icon="UserIcon"
                            class="mr-50"
                        />
                        <span>Profile</span>
                    </b-dropdown-item>

                    <b-dropdown-divider/>

                </template>

                <b-dropdown-item @click="logout" link-class="d-flex align-items-center">
                    <feather-icon
                        size="16"
                        icon="LogOutIcon"
                        class="mr-50"
                    />
                    <span>Logout</span>
                </b-dropdown-item>
            </b-nav-item-dropdown>
        </b-navbar-nav>
    </div>
</template>

<script>
    import {
        BLink, BNavbarNav, BNavItemDropdown, BDropdownItem, BDropdownDivider, BAvatar,
    } from 'bootstrap-vue'
    import DarkToggler from '@core/layouts/components/app-navbar/components/DarkToggler.vue'
    import {isAllowed} from "@/libs/helpers";
    import {post} from "@/libs/api";
    import NotificationDropdown from "@core/layouts/components/app-navbar/components/NotificationDropdown";

    export default {
        components: {
            NotificationDropdown,
            BLink,
            BNavbarNav,
            BNavItemDropdown,
            BDropdownItem,
            BDropdownDivider,
            BAvatar,

            // Navbar Components
            DarkToggler,
        },
        props: {
            toggleVerticalMenuActive: {
                type: Function,
                default: () => {
                },
            },
        },
        data() {
            return {
                user_name: window.apex.user.name,
                user_roles: window.apex.user.roles
            }
        },
        computed: {
            view_profile() {
                return isAllowed('view-profile');
            }
        },
        mounted() {
            // Load Google Translate Website Translator
            const googleTranslateScript = document.createElement('script');
            googleTranslateScript.type = 'text/javascript';
            googleTranslateScript.async = true;
            googleTranslateScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            document.body.appendChild(googleTranslateScript);

            // Initialize the translation dropdown
            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        includedLanguages: 'zh-CN,zh-TW,af,sq,am,ar,hy,az,eu,be,bn,bs,bg,ca,ceb,ny,co,hr,cs,da,nl,en,eo,et,tl,fi,fr,fy,gl,ka,de,el,gu,ht,ha,haw,iw,hi,hmn,hu,is,ig,id,ga,it,ja,jw,kn,kk,km,ko,ku,ky,lo,la,lv,lt,lb,mk,mg,ms,ml,mt,mi,mr,mn,my,ne,no,ps,fa,pl,pt,ro,ru,sm,gd,sr,st,sn,es,tr', // Adjust the languages as needed
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false
                    },
                    'google_translate_element'
                );
            };
        },
        methods: {
            logout() {
                post('/logout', {
                    id: window.apex.user.id
                }).then((res) => {
                    window.location = "/login";
                })
            },
            goToProfile() {
                this.$router.push('/profile');
            }

        }
    }
</script>
