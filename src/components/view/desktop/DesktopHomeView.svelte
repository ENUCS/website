<!-- 
~~~~~~~~~~~~
	COMPONENT JS (w/ TS)
~~~~~~~~~~~~
-->

<script lang='ts'>
    import {
        onMount,
        onDestroy
    } from "svelte";

    /**
     * When everyhting has loaded on the website,
     * execute;
     */
    onMount(async () => {
        animateTargetDiv('pc-bubble', true);
        animateTargetDiv('code-bubble', true);
        animateTargetDiv('eth-bubble', true);
        animateTargetDiv('branch-bubble', true);
        animateTargetDiv('pc-masterrace-bubble', true);
        animateTargetDiv('beers-bubble', true);
        animateTargetDiv('vs-code-bubble', true);
    });

    /**
     * Desc: Animates the Target DIV for the randomly 
     * moving container
     * @param divID
     */
    function animateTargetDiv(divID: string, firstInstance ? : boolean) {
        var targetElem = document.getElementById(divID)
        if (targetElem == null) {
            return;
        }
        var newq: number[] = makeNewPosition();
        if (firstInstance) {
            targetElem.style.left = `${newq[0]}px`;
            targetElem.style.top = `${newq[1]}px`;
        }
        var oldqTop: number = targetElem.offsetTop
        var oldqLeft: number = targetElem.offsetLeft
        var speed: number = calcSpeed([oldqTop, oldqLeft], newq);

        // animation declaration & execution,
        var animation = targetElem.animate([
            // { transform: 'translate('+`${newq[1]}px`+','+`${newq[0]}px`+')' }
            {
                top: `${newq[0]}px`,
                left: `${newq[1]}px`
            }
        ], {
            duration: speed,
            easing: 'linear',
        });

        // on-animation end (completed),
        animation.onfinish = function () {
            targetElem.style.top = `${newq[0]}px`;
            targetElem.style.left = `${newq[1]}px`;
            animateTargetDiv(divID);
        }

        animation.oncancel = function () {
            console.log('animation has been cancelled!')
        }
    };

    /**
     *  Desc: Generates a new position for a target,
     *  div randomly moving container, 
     */
    function makeNewPosition() {
        // Get viewport dimensions (remove the dimension of the div)
        var h = window.innerHeight - 50;
        var w = window.innerWidth - 50;
        var nh = Math.floor(Math.random() * h);
        var nw = Math.floor(Math.random() * w);
        return [nh, nw];
    };

    /**
     *  Desc: Calculates the speed for the movement of a target,
     *  div container, in relation to the previous & new positions,
     *  @param prev
     *  @param next
     */
    function calcSpeed(prev: number[], next: number[]) {
        var x = Math.abs(prev[1] - next[1]);
        var y = Math.abs(prev[0] - next[0]);
        var greatest = x > y ? x : y;
        var speedModifier: number = 0.05;
        var speed: number = Math.ceil(greatest / speedModifier);
        return speed;
    };

	onDestroy(async() => {
		console.log('the component is being destroyed');
	});
</script>

<!-- 
~~~~~~~~~~~~
	COMPONENT STYLE
~~~~~~~~~~~~
-->

<style>
    /*
    randomly-moving continers */
    div.moving-random-div {
        width: 50px;
        height: 50px;
        background-color: transparent;
        position: absolute;
        background-size: auto;
        background-repeat: no-repeat;
        background-position: center;
    }

    div.moving-random-div#pc-bubble {
        background-image: url('/assets/svg/icons/dektop-pc-icon.svg');
    }

    div.moving-random-div#code-bubble {
        background-image: url('/assets/svg/icons/code-icon.svg');
    }

    div.moving-random-div#eth-bubble {
        background-image: url('/assets/svg/icons/ethereum-icon.svg');
    }

    div.moving-random-div#branch-bubble {
        background-image: url('/assets/svg/icons/git-branch.svg');
    }

    div.moving-random-div#pc-masterrace-bubble {
        background-image: url('/assets/svg/icons/pc-masterrace.svg');
    }

    div.moving-random-div#beers-bubble {
        background-image: url('/assets/svg/icons/beers-icon.svg');
    }

    div.moving-random-div#vs-code-bubble {
        background-image: url('/assets/svg/icons/vs-code-icon.svg');
    }

    /* 
    hero-welcome section SVG DESKTOP */
    svg {
        width: auto;
        height: auto;
        margin: calc(100vh / 2.983) calc(100vw / (var(--desktop) / 240)) calc(100vh / 4.183) calc(100vw / (var(--desktop) / 240));
    } svg #desktop-hero-frame_svg__become-member-btn {
        cursor: pointer;
    } svg #desktop-hero-frame_svg__become-member-btn:hover rect {
        fill: coral;
        transition: all 0.5s ease-in-out;
    } svg #desktop-hero-frame_svg__become-member-btn:hover text {
        fill: black;
        transition: all 0.5s ease-in-out;
    }
</style>

<!-- 
~~~~~~~~~~~~
	COMPONENT HTML
        src='./assets/img/enucs_logo_brand_nav.png' 
~~~~~~~~~~~~
-->

<div id='pc-bubble' class='moving-random-div' />
<div id='code-bubble' class='moving-random-div' />
<div id='eth-bubble' class='moving-random-div' />
<div id='branch-bubble' class='moving-random-div' />
<div id='pc-masterrace-bubble' class='moving-random-div' />
<div id='beers-bubble' class='moving-random-div' />
<div id='vs-code-bubble' class='moving-random-div' />
<!--  -->
<svg width="100%" height="100%" viewBox="0 0 956 223" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="desktop-hero-frame_svg__desktop-hero-frame">
        <g id="desktop-hero-frame_svg__Computing_Society" font-family="Roboto Slab" font-size="48.762"
            font-weight="bold" letter-spacing="0em">
            <text fill="#000" xml:space="preserve" style="white-space:pre">
                <tspan x="4.405" y="67.941">Computing </tspan>
            </text>
            <text fill="#C62828" xml:space="preserve" style="white-space:pre">
                <tspan x="274.214" y="67.941">Society</tspan>
            </text>
        </g>
        <text id="desktop-hero-frame_svg__exploring_and_learning_technology" fill="#000" xml:space="preserve"
            style="white-space:pre" font-family="Roboto" font-size="24" font-weight="500" letter-spacing="0em">
            <tspan x="4" y="113.203">exploring and learning technology</tspan>
        </text>
        <a href="https://www.napierstudents.com/organisation/societies/7541/">
            <g id="desktop-hero-frame_svg__become-member-btn" filter="url(#desktop-hero-frame_svg__filter0_d)">
                <rect x="4" y="142" width="219" height="52" rx="5" fill="#00A3FF" />
                <text id="desktop-hero-frame_svg__Become_a_member" fill="#fff" xml:space="preserve" style="white-space:pre"
                    font-family="Roboto Slab" font-size="19.5" font-weight="bold" letter-spacing="0em">
                    <tspan x="28" y="175.574">Become a member</tspan>
                </text>
            </g>
        </a>
        <g id="desktop-hero-frame_svg__info-hero-card" filter="url(#desktop-hero-frame_svg__filter1_d)">
            <path id="desktop-hero-frame_svg__Vector_22"
                d="M940.255 4H714.503c-2.34 0-4.358 1.626-4.939 3.892-9.588 37.37-34.688 70.01-20.064 96.108 14.367 25.639-12.503 59.142-22.979 96.944-.855 3.086 1.521 6.056 4.724 6.056h225.752c2.34 0 4.357-1.626 4.944-3.892 9.952-38.413 37.059-68.63 22.145-99.108-14.606-29.849 10.746-57.904 20.881-93.944.867-3.083-1.509-6.056-4.712-6.056z"
                fill="#fff" />
            <path id="desktop-hero-frame_svg__code-icon"
                d="m799.678 143.425-9.115-2.645c-.956-.269-1.494-1.27-1.225-2.227l20.396-70.259c.269-.956 1.27-1.494 2.227-1.225l9.114 2.645c.957.269 1.495 1.27 1.226 2.226L801.904 142.2a1.79 1.79 0 0 1-2.226 1.226zm-17.034-16.766 6.5-6.933a1.793 1.793 0 0 0-.12-2.57l-13.538-11.909 13.538-11.91a1.78 1.78 0 0 0 .12-2.57l-6.5-6.932a1.796 1.796 0 0 0-2.541-.075l-21.531 20.172a1.78 1.78 0 0 0 0 2.615l21.531 20.187a1.783 1.783 0 0 0 2.541-.075zm48.891.09 21.532-20.187a1.781 1.781 0 0 0 0-2.615l-21.532-20.202a1.81 1.81 0 0 0-2.54.075l-6.5 6.933a1.793 1.793 0 0 0 .119 2.57l13.538 11.924-13.538 11.909a1.78 1.78 0 0 0-.119 2.57l6.5 6.933c.672.732 1.808.762 2.54.09z"
                fill="#000" />
        </g>
    </g>
    <defs>
        <filter id="desktop-hero-frame_svg__filter0_d" x="0" y="142" width="227" height="60"
            filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <filter id="desktop-hero-frame_svg__filter1_d" x="655" y="0" width="301.5" height="223"
            filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dy="6" />
            <feGaussianBlur stdDeviation="5" />
            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.49 0" />
            <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
    </defs>
</svg>