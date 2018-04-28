document.addEventListener('DOMContentLoaded', function () {
  var match = document.location.hash.match(/#(\d+)-(\d+)/)
  if (match) {
    let p = document.getElementById(match[1])
    window.scrollTo({
      top: p.offsetTop - 5
    })
    for (let index = match[1]; index <= match[2]; index++) {
      document.getElementById(index).classList.add('highlight')
    }
  }
})
