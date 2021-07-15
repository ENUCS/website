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

    onDestroy(async () => {
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
        width: -webkit-fill-available;
        height: auto;
        margin: calc(100vh / 2.983) calc(100vw / 20.833) calc(100vh / 2.80) calc(100vw / 20.833);
    }
</style>

<!-- 
~~~~~~~~~~~~
	COMPONENT HTML
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
<svg width="306" height="127" viewBox="0 0 306 127" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="mobile-hero-frame_svg__mobile-hero-frame">
        <g id="mobile-hero-frame_svg__Computing_Society" font-family="Roboto Slab" font-size="33.32" font-weight="bold"
            letter-spacing="0em">
            <text fill="#000" xml:space="preserve" style="white-space:pre">
                <tspan x="3.277" y="34.808">Computing </tspan>
            </text>
            <text fill="#C62828" xml:space="preserve" style="white-space:pre">
                <tspan x="187.641" y="34.808">Society</tspan>
            </text>
        </g>
        <text id="mobile-hero-frame_svg__exploring_and_learning_technology" fill="#000" xml:space="preserve"
            style="white-space:pre" font-family="Roboto" font-size="16.399" font-weight="500" letter-spacing="0em">
            <tspan x="3" y="65.737">exploring and learning technology</tspan>
        </text>
        <a href="https://www.napierstudents.com/organisation/societies/7541/">
            <g id="mobile-hero-frame_svg__become-member-btn" filter="url(#mobile-hero-frame_svg__filter0_d)">
                <rect x="3" y="85.414" width="149.645" height="35.532" rx="3.417" fill="#00A3FF" />
                <text id="mobile-hero-frame_svg__Become_a_member" fill="#fff" xml:space="preserve" style="white-space:pre"
                    font-family="Roboto Slab" font-size="13.325" font-weight="bold" letter-spacing="0em"
                    text-decoration="underline">
                    <tspan x="19.399" y="108.473">Become a member</tspan>
                </text>
            </g>
        </a>
    </g>
    <defs>
        <filter id="mobile-hero-frame_svg__filter0_d" x=".267" y="85.414" width="155.112" height="40.999"
            filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dy="2.733" />
            <feGaussianBlur stdDeviation="1.367" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
    </defs>
</svg>