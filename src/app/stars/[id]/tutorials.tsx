import Tutorial, { TutorialStep, clearTutorialElems } from '@/components/tutorial/Tutorial'

export const SHIPS_TUTORIAL_STEPS: TutorialStep[] = [
  {
    text: {
      orientation: 'bottom',
      offset: 190,
      content: (
        <div>
          This is the <b>Star</b> view. It is where most of the action happens!
          <br/><br/>
          In the top left corner you can find the star&apos;s basic physical characteristics - luminosity, radius and mass.
        </div>
      )
    },
    highlight: {
      id: 'star-basic-info',
      angle: 270,
      offset: 90,
      shift: -30
    }
  },
  {
    text: {
      orientation: 'bottom',
      offset: 190,
      content: (
        <div>
          In the top right corner you can find <b>star controls</b>. Let&apos;s go quickly through theam.
          <br /><br />
          You can get more info about each control by clicking an info button in the control&apos;s dialog.
          <br /><br />
          The first one is the <b>Radar</b>. It shows you all the ships and other objects that are in the star&apos;s orbit.
          You can select another ship from the list displayed by the <b>Radar</b> to interact with it.
        </div>
      )
    },
    highlight: {
      id: 'star-ctrl-radar',
      angle: 0,
      offset: 105,
      shift: -25
    }
  },
  {
    text: {
      orientation: 'bottom',
      offset: 190,
      content: (
        <div>
          Use this button when you want to send one of your ships to this star.
          <br /><br />
          You will need some Solarwind (SLW) to do that. Good news is that Solarwind (SLW) is collected by your ships when they simply orbit a star.
          Just remember to collect it in Ship controls from time to time.
        </div>
      )
    },
    highlight: {
      id: 'star-ctrl-send',
      angle: 180,
      offset: 105,
      shift: -25
    }
  },
  {
    text: {
      orientation: 'bottom',
      offset: 190,
      transparent: true,
      content: (
        <div>
          Do you see bright dots moving around the star? Those are ships. You can click and select any of them to interact with it!
          <br /><br />
          If it is your ship, you can collect the Solarwind (SLW) it has harvested so far or send it to another star.
          If it&apos;s another player&apos;s ship, you can try your luck and attack it to steal its Solarwind (SLW) harvest!
          <br /><br />
          You can also access the ships in the star&apos;s orbit by clicking the <b>Radar</b> button in the top right corner.
        </div>
      )
    },
    highlight: {
      id: 'focused-star',
      angle: 0,
      offset: 25,
      outward: true
    }
  },
  {
    text: {
      orientation: 'bottom',
      offset: 190,
      content: (
        <div>
           In the bottom right of the screen you can find the <b>App controls</b>.
           You can use them to transition to other parts of the metaverse app - <b>Stars</b>, <b>Ships</b> and <b>Market</b>.
        </div>
      )
    },
    highlight: {
      id: 'app-ctrl-stars',
      angle: 0,
      offset: 105,
      shift: -25
    }
  }

]