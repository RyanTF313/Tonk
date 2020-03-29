const join = document.getElementById('join')

join.addEventListener('click', ()=>{  
        const user = document.getElementById("user").dataset.user
        const id = document.querySelector('input[name="tableId"]').value
        const limit = document.querySelector('input[name="limit"]').value
        let players = document.querySelector('input[name="players"]').value
        players = JSON.parse(players)

        if (players.length >= limit) {
          document.getElementById('message').innerHTML = "Table is Full sorry"
          return
        }
        if (players.includes(user)) {
          document.getElementById('message').innerHTML = "You are at this table already"
          return
        }
        players.push(user)
        
        fetch('tables', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            '_id': id,
            'players': players
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
})