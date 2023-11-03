import { nextTick, reactive } from 'vue'
import VueProgressBar from './vue-progressbar.vue'

const PROVIDER = 'vue-progressbar'

export default {
  install: (app, options) => {
    const DEFAULT_OPTION = {
      canSuccess: true,
      show: false,
      color: '#73ccec',
      position: 'fixed',
      failedColor: 'red',
      thickness: '2px',
      transition: {
        speed: '0.2s',
        opacity: '0.6s',
        termination: 300
      },
      autoRevert: true,
      location: 'top',
      inverse: false,
      autoFinish: true
    }

    const progressOptions = Object.assign(DEFAULT_OPTION, options)

    const PROGRESS_BAR = reactive({
      percent: 0,
      options: progressOptions
    })

    app.provide('PROGRESS_BAR', PROGRESS_BAR)

    let Progress = {
      state: {
        tFailColor: '',
        tColor: '',
        timer: null,
        cut: 0
      },
      start (time) {
        if (!time) time = 3000
        PROGRESS_BAR.percent = 0 // PROGRESS_BAR.percent
        PROGRESS_BAR.options.show = true
        PROGRESS_BAR.options.canSuccess = true
        this.state.cut = 10000 / Math.floor(time)
        clearInterval(this.state.timer)
        this.state.timer = setInterval(() => {
          this.increase(this.state.cut * Math.random())
          if (PROGRESS_BAR.percent > 95 && PROGRESS_BAR.options.autoFinish) {
            this.finish()
          }
        }, 100)
      },
      set (num) {
        PROGRESS_BAR.options.show = true
        PROGRESS_BAR.options.canSuccess = true
        PROGRESS_BAR.percent = Math.floor(num)
      },
      get () {
        return Math.floor(PROGRESS_BAR.percent)
      },
      increase (num) {
        PROGRESS_BAR.percent = Math.min(99, PROGRESS_BAR.percent + Math.floor(num))
      },
      decrease (num) {
        PROGRESS_BAR.percent = PROGRESS_BAR.percent - Math.floor(num)
      },
      hide () {
        clearInterval(this.state.timer)
        this.state.timer = null
        setTimeout(() => {
          PROGRESS_BAR.options.show = false
          nextTick(() => {
            setTimeout(() => {
              PROGRESS_BAR.percent = 0
            }, 100)
            if (PROGRESS_BAR.options.autoRevert) {
              setTimeout(() => {
                this.revert()
              }, 300)
            }
          })
        }, PROGRESS_BAR.options.transition.termination)
      },
      pause () {
        clearInterval(this.state.timer)
      },
      finish () {
        PROGRESS_BAR.percent = 100
        this.hide()
      },
      fail () {
        PROGRESS_BAR.options.canSuccess = false
        PROGRESS_BAR.percent = 100
        this.hide()
      },
      setFailColor (color) {
        PROGRESS_BAR.options.failedColor = color
      },
      setColor (color) {
        PROGRESS_BAR.options.color = color
      },
      setLocation (loc) {
        PROGRESS_BAR.options.location = loc
      },
      setTransition (transition) {
        PROGRESS_BAR.options.transition = transition
      },
      tempFailColor (color) {
        this.state.tFailColor = PROGRESS_BAR.options.failedColor
        PROGRESS_BAR.options.failedColor = color
      },
      tempColor (color) {
        this.state.tColor = PROGRESS_BAR.options.color
        PROGRESS_BAR.options.color = color
      },
      tempLocation (loc) {
        this.state.tLocation = PROGRESS_BAR.options.location
        PROGRESS_BAR.options.location = loc
      },
      tempTransition (transition) {
        this.state.tTransition = PROGRESS_BAR.options.transition
        PROGRESS_BAR.options.transition = transition
      },
      revertColor () {
        PROGRESS_BAR.options.color = this.state.tColor
        this.state.tColor = ''
      },
      revertFailColor () {
        PROGRESS_BAR.options.failedColor = this.state.tFailColor
        this.state.tFailColor = ''
      },
      revertLocation () {
        PROGRESS_BAR.options.location = this.state.tLocation
        this.state.tLocation = ''
      },
      revertTransition () {
        PROGRESS_BAR.options.transition = this.state.tTransition
        this.state.tTransition = {}
      },
      revert () {
        if (PROGRESS_BAR.options.autoRevert) {
          if (this.state.tColor) {
            this.revertColor()
          }
          if (this.state.tFailColor) {
            this.revertFailColor()
          }
          if (this.state.tLocation) {
            this.revertLocation()
          }
          if (
            this.state.tTransition &&
            (this.state.tTransition.speed !== undefined ||
              this.state.tTransition.opacity !== undefined)
          ) {
            this.revertTransition()
          }
        }
      },
      parseMeta (meta) {
        for (var x in meta.func) {
          let func = meta.func[x]
          switch (func.call) {
            case 'color':
              switch (func.modifier) {
                case 'set':
                  this.setColor(func.argument)
                  break
                case 'temp':
                  this.tempColor(func.argument)
                  break
              }
              break
            case 'fail':
              switch (func.modifier) {
                case 'set':
                  this.setFailColor(func.argument)
                  break
                case 'temp':
                  this.tempFailColor(func.argument)
                  break
              }
              break
            case 'location':
              switch (func.modifier) {
                case 'set':
                  this.setLocation(func.argument)
                  break
                case 'temp':
                  this.tempLocation(func.argument)
                  break
              }
              break
            case 'transition':
              switch (func.modifier) {
                case 'set':
                  this.setTransition(func.argument)
                  break
                case 'temp':
                  this.tempTransition(func.argument)
                  break
              }
              break
          }
        }
      }
    }

    app.component('VueProgressBar', VueProgressBar)
    app.provide(PROVIDER, Progress)
    app.config.globalProperties.$progressBar = Progress
  }
}
