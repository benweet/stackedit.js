<script src="lib/stackedit.js"></script>

# stackedit.js

<script>
function configureTextarea(el) {
  const div = document.createElement('div');
  div.className = 'stackedit-button-wrapper'
  div.innerHTML = '<a href="javascript:void(0)">Edit with StackEdit<img src="icon.svg"></a>';
  div.firstChild.addEventListener('click', function () {
    console.log(el.value);
  });
  el.parentNode.insertBefore(div, el.nextSibling);
}
</script>

<textarea class="case1"></textarea>

<script>
configureTextarea(document.querySelector('.case1'));

</script>
