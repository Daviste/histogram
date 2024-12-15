export default function getTranslateY (el) {
  if (!window.getComputedStyle) return
  var style = getComputedStyle(el),
    transform = style.transform || style.webkitTransform || style.mozTransform
  var mat = transform.match(/^matrix3d\((.+)\)$/)
  if (mat) return parseFloat(mat[1].split(', ')[13])
  mat = transform.match(/^matrix\((.+)\)$/)
  return mat ? parseFloat(mat[1].split(', ')[5]) : 0
}