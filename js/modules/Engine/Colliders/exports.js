import _CircleCollider from "./CircleCollider.js";
import _Collider from "./Collider.js";
import _PathCollider from "./PathCollider.js";
import _RectCollider from "./RectCollider.js";
import _RoundedRectCollider from "./RoundedRectCollider.js";

export let CircleCollider = _CircleCollider;
export let Collider = _Collider;
export let PathCollider = _PathCollider;
export let RectCollider = _RectCollider;
export let RoundedRectCollider = _RoundedRectCollider;

export default {
  CircleCollider: _CircleCollider,
  Collider: _Collider,
  PathCollider: _PathCollider,
  RectCollider: _RectCollider,
  RoundedRectCollider: _RoundedRectCollider,
};
