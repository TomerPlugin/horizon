const mainDiv =
<div style="width: 500px; height: 500px; border-radius: 5px">
    {
        $.ajax({ url: 'localhost:3000', success: function(data) { alert(data); } })
    }
</div>

function renderer() {
  document.getElementById("mainDiv").appendChild(mainDiv);
}

export default renderer;