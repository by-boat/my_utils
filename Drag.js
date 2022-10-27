import utils from 'utils';
import { getGameStore } from '@/store/game';

/**
 * 拖拽类
 * author LaiWeifeng
 * since 2016/3/22
 */
var Drag = function (target, options) {
  var _x = 0,
    _y = 0,
    _moveDrag, _stopDrag;

  +function () {
    this.target = target; //被拖拽的对象
    var defaultOptions = {
      handle: target, //拖拽区域对象
      handleWidth: 0,
      handleHeight: 0,
      limit: true, //锁定范围(使不出浏览器范围)
      lock: false, //锁定位置(禁止拖拽)
      lockX: false, //锁定水平位置
      lockY: false, //锁定垂直位置
      showMoveCursor: false, //拖拽区域光标是否变化
      container: document.body, //指定限制容器
      onStart: function () { }, //开始时回调函数
      onMove: function () { }, //拖拽时回调函数
      onStop: function () { } //停止时回调函数
    };
    for (var p in options) defaultOptions[p] = options[p];
    for (var p in defaultOptions) this[p] = defaultOptions[p];

    _moveDrag = bind(this, moveDrag);
    _stopDrag = bind(this, stopDrag);

    if (this.showMoveCursor) {
      this.handle.style.cursor = "move";
    }
    target.style.top = target.offsetTop + "px";
    target.style.left = target.offsetLeft + "px";
    target.style.position = "fixed";
    target.style.margin = "0";
    addHandler(this.handle, "touchstart", bind(this, startDrag));

    var _this = this;
    this.enable = true;
    this.setEnable = function (v) {
      _this.enable = v;
    };
  }.apply(this, arguments);

  function startDrag(event) {
    event.preventDefault && event.preventDefault();
    event.stopPropagation && event.stopPropagation();

    if (!this.enable) return;
    var evt = event.changedTouches[0];

    const { isRotate, angle } = getGameStore();
    let { x, y } = utils.getTouchPos(evt, isRotate, angle, this.container);

    _x = x - target.offsetLeft;
    _y = y - target.offsetTop;

    addHandler(this.container, "touchmove", _moveDrag);
    addHandler(this.container, "touchend", _stopDrag);
    addHandler(this.container, "touchcancel", _stopDrag);

    this.handle.setCapture && this.handle.setCapture();
    this.onStart && this.onStart(event);
  }

  function moveDrag(event) {
    event.preventDefault && event.preventDefault();
    event.stopPropagation && event.stopPropagation();

    if (!this.enable || this.lock) return;
    var evt = event.changedTouches[0];

    const { isRotate, angle } = getGameStore();
    let { x, y } = utils.getTouchPos(evt, isRotate, angle, this.container);

    var iLeft = x - _x;
    var iTop = y - _y;

    var maxTop = this.container.clientHeight - (this.handleHeight || this.target.offsetHeight);
    var maxLeft = this.container.clientWidth - (this.handleWidth || this.target.offsetWidth);
    if (this.limit) {
      iTop = iTop < 0 ? 0 : iTop;
      iTop = iTop > maxTop ? maxTop : iTop;
      iLeft = iLeft < 0 ? 0 : iLeft;
      iLeft = iLeft > maxLeft ? maxLeft : iLeft;
    }
    this.lockY || (target.style.top = iTop + "px");
    this.lockX || (target.style.left = iLeft + "px");

    this.onMove && this.onMove(event);
  }

  function stopDrag(event) {
    removeHandler(this.container, "touchmove", _moveDrag);
    removeHandler(this.container, "touchend", _stopDrag);
    removeHandler(this.container, "touchcancel", _stopDrag);
    this.handle.releaseCapture && this.handle.releaseCapture();
    this.onStop && this.onStop(event);
  }

  //添加绑定事件
  function addHandler(oElement, sEventType, fnHandler) {
    //return oElement.addEventListener(sEventType, fnHandler, false);
    let param = sEventType == 'touchmove' ? { passive: false } : false;
    return oElement.addEventListener(sEventType, fnHandler, param);
  }
  //删除绑定事件
  function removeHandler(oElement, sEventType, fnHandler) {
    return oElement.removeEventListener(sEventType, fnHandler, false);
  }
  //绑定事件到对象
  function bind(object, fnHandler) {
    return function () {
      return fnHandler.apply(object, arguments);
    }
  }
}

export default Drag;
