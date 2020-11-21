import { reactive, toRefs, ref, onMounted, onBeforeMount } from 'vue'
import { debounce } from '@halobear/utils/throttle-debounce'
import WaterFallData from '../utils/WaterFallData'

export default (itemWidth, data = []) => {
  const state = reactive({
    list: data, // 瀑布流数据源
    containerWidth: '100%',
    containerHeight: 0,
  })

  const container = ref(null) // 父元素
  let waterfall = null // 瀑布流数据管理
  let colNum = 1

  const handleData = ({ data, containerHeight }) => {
    state.list =
      state.list.length > data.length ? [...data, ...state.list.slice(data.length)] : data
    state.containerHeight = containerHeight
  }

  const initData = (optionData) => {
    if (!waterfall) return
    handleData(waterfall.init(optionData))
  }

  const setContainerWidth = () => {
    colNum = Math.floor(container.value.clientWidth / itemWidth) || 1
    state.containerWidth = `${colNum * itemWidth}px`
  }

  const initWaterFall = () => {
    setContainerWidth()
    waterfall = new WaterFallData(itemWidth, colNum)
  }

  const windowResize = debounce(() => {
    if (!waterfall) return
    setContainerWidth()
    handleData(waterfall.resize(itemWidth, colNum))
  })

  onMounted(() => {
    initWaterFall()
    window.addEventListener('resize', windowResize)
  })

  onBeforeMount(() => {
    window.removeEventListener('resize', windowResize)
  })

  return {
    ...toRefs(state),
    container,
    initData,
    setState: (list) => (state.list = list),
  }
}
