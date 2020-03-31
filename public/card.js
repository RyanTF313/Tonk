let getDeck = document.getElementsByClassName('getDeck')
let shuffle = document.getElementsByClassName('shuffle')
let getCards = document.getElementsByClassName('getCards')
let discard = document.getElementsByClassName('discard')
let drawDeck = document.getElementsByClassName('drawDeck')
let drawPile = document.getElementsByClassName('drawPile')
let drop = document.getElementsByClassName('drop')
const cardAPI = 'https://deckofcardsapi.com/api/deck/new/'

Array.from(getDeck).forEach((el)=>{
    el.addEventListener('click', ()=>{
        fetch(cardAPI, {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
          })
          .then(response => {
            if (response.ok) return response.json()
          })
          .then(data => {
            console.log(data)
            assignDate(data.deck_id)
            window.location.reload(true)
          })
    })
})
Array.from(shuffle).forEach((el)=>{
    let deck_id = el.dataset.deck_id
    let cardAPI = `https://deckofcardsapi.com/api/deck/${deck_id}/shuffle/`
    el.addEventListener('click', ()=>{
        // console.log(cardAPI);
        fetch(cardAPI, {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
          })
          .then(response => {
            if (response.ok) return response.json()
          })
          .then(data => {
            console.log(data)
            updateShuffle(deck_id)
            window.location.reload(true)
          })
    })
})
let assignDate = (id)=>{
    const tableId = document.querySelector('input[name="tableId"]').value
        fetch('addDeck', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'deck_id': id,
              'table_id': tableId
            })
          })
          .then(response => {
            if (response.ok) return response.json()
          })
          .then(data => {
            console.log(data)
            window.location.reload(true)
          })
}
let updateShuffle = (id)=>{
    const tableId = document.querySelector('input[name="tableId"]').value
    fetch('shuffle', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          'table_id': tableId,
          'deck_id': id,
          'shuffle': true
        })
      })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        window.location.reload(true)
      })
}
// fetch('tables', {
//     method: 'put',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({
//       '_id': id,
//       'players': players
//     })
//   })
//   .then(response => {
//     if (response.ok) return response.json()
//   })
//   .then(data => {
//     console.log(data)
//     window.location.reload(true)
//   })