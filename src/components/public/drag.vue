<template>
  <div class="dialog-drag"
    :id='id'
    :style='dialogStyle'
    @mousedown="startClick"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'drag',
  props: ['id', 'options'],
  data () {
    return {
      offset: {
        x: 0,
        y: 0
      },
      left: 0,
      top: 0,
      dragging: 0,
    }
  },
  created () {
    this.setOptions(this.options)
  },
  mounted () {
    document.addEventListener('mousemove', this.mouseMove, { passive: true })
    document.addEventListener('mouseup', this.mouseUp)
     this.$once('hook:beforeDestroy', () => {
       document.removeEventListener('mousemove', this.mouseMove)
      document.removeEventListener('mouseup', this.mouseUp)
    })
  },
  watch: {
    'options': {
      handler(newValue) {
        console.log('变化');
        console.log(newValue);
        this.setOptions(newValue)
      },
      deep: true
    }
  },
  computed: {
    dialogStyle () {
      const style = { left: this.left + 'px', top: this.top + 'px' }
      return style
    }
  },
  methods: {
    mouseDown (event) {
      this.startMove(event)
      this.clearSelection()
    },
    mouseMove (event) {
      if (this.dragging) {
        setTimeout(this.move(event), 50)
      }
    },
    mouseUp (event) {
      event.preventDefault()
        this.stopMove()
        // this.$emit('chageaxis',{x:this.left,y:this.top})
        // this.emit('dragEnd')
    },
    stopMove () {
      this.dragging = false
      this.pX = 0
      this.pY = 0
    },
    move (event) {
      if (this.dragging) {
        if (event.clientX === 0) event = this.overEvent // for firefox
        if (event && event.clientX && event.clientY) {
          const x = event.clientX
          const y = event.clientY
          // 边界处理
          const limitLeft = window.innerWidth - this.$el.clientWidth
          const limitTop = window.innerHeight - this.$el.clientHeight
          const left = x + this.offset.x
          const top = y + this.offset.y
          this.left = left < 0 ? 0 : left > limitLeft ? limitLeft : left
          this.top = top < 0 ? 0 : top > limitTop ? limitTop : top
          this.dragging++
          this.$emit('chageaxis',{x:this.left.toFixed(2),y:this.top.toFixed(2)})
          // this.emit('move')
        }
      }
    },
    clearSelection () {
      if (document.selection) {
        document.selection.empty()
      } else if (window.getSelection) {
        window.getSelection().removeAllRanges()
      }
    },
    startMove (event) {
      const x = this.left - event.clientX
      const y = this.top - event.clientY
      this.offset = { x, y }
      this.dragging = 1
      // this.emit('drag-start')
    },
    startClick (ev) {
      // this.emit('drag-start')
      this.mouseDown(ev)
    },
    setOptions (options) {
      if (options) {
         this.left = options.xAxis ? options.xAxis : 0
         this.top = options.yAxis ? options.yAxis : 0
      }
    }
  }
}
</script>
