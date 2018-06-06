
import { connect } from 'dva'
import Index from './index'

function mapStateToProps({ home: {count, homeInfo}}) {
  return {count, homeInfo}
}
function mapDispatchToProps(dispatch) {
  return {
    add: count => dispatch({ type: 'home/add', count}),
    getHomeInfo: () => dispatch({ type: 'home/getHomeInfo' }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)