#
#*  Author : Pavle Paunovic
#* 
Module = (->
  
  # Private
  
  # Map for keyboard key codes
  keysMap = {}
  
  # Public
  
  # Append to keysMap object, name of properties are keycode numbers
  # Value of properties are control panel icons(or divs) and li elements
  createKeysMap: ->
    i = 0

    while i < keyDivs.length
      keysMap[keyCodes[i]] = keyDivs[i]
      i++
    return

  help: ->
    help.addEventListener "click", ((e) ->
      unless help.className is "helpToggle"
        i = 0

        while i < wrap.length
          p = document.createElement("p")
          p.appendChild document.createTextNode(niz[i])
          wrap[i].appendChild p
          i++
        help.className = "helpToggle"
      else
        help.className = "help"
        $(".innerLines p").remove()
      return
    ), false
    return

  
  # Create every note for each of the music lines(that includes ledger to)
  # Same algorithm is used as above for toggling element(or when second time is clicked on icon)
  # moreToLife/topLedgerNotes/bottomLedger values == map, where notes will be appended.
  ledger: ->
    ledger.addEventListener "click", ((e) ->
      unless ledger.className is "ledgerToggle"
        i = 0

        while i < 3
          div = document.createElement("div")
          div.className = ledgerName[i]
          w.appendChild div
          i++
        
        # Make moreToLife public
        moreToLife = []
        moreToLife = "E0 F0 G0 A0 B0 C0 D E F G A B C D1 E1 F1 G1 A1 B1 C1 D2 E2 F2".split(" ")
        j = 0

        while j < 3
          outerDiv = document.createElement("div")
          outerDiv.className = outerLedger[j]
          outerLines.appendChild outerDiv
          j++
        ledger.className = "ledgerToggle"
      else
        
        # When ledger icon is clicked second time, then revert moretolife to default
        # Random notes then will use default map(4 default music lines)
        $(".line1 > img").attr "class", "D"
        moreToLife.splice 0, 6
        moreToLife.splice 11, 18
        ledger.className = "ledger"
        $(".line6").remove()
        $(".line7").remove()
        $(".line8").remove()
        $(".line-1").remove()
        $(".line-2").remove()
        $(".line-3").remove()
      return
    ), false
    return

  randomAlgorithm: ->
    $(".line1 > img").attr("src", "icons/singleNote.png").attr "class", moreToLife[Math.floor(Math.random() * moreToLife.length)]
    return

  newNote: ->
    newNote.addEventListener "click", ->
      Module.randomAlgorithm()
      return

    return

  score: ->
    score.addEventListener "click", ((e) ->
      getImg = $(".line1 > img")
      wrongNote = $(".wrongNote > p")
      oldNote = getImg.attr("class")
      getImg.attr "class", getImg.attr("class").substr(0, 1)  if getImg.attr("class").length is 2
      if e.target
        if e.target.innerHTML is getImg.attr("class")
          positiveScore++
          $(".positive  > p").html positiveScore
          Module.randomAlgorithm()
          $(".wrongNote > p").html ""
        else
          negativeScore++
          $(".negative  > p").html negativeScore
          Module.randomAlgorithm()
          
          # oldNote.substr(0, 1)
          #                  $(".wrongNote > p").html("Wrong, correct note is : " + oldNote.substr(0, 1));
          unless wrongNote.attr("class") is "wrong"
            wrongNote.html "Wrong, correct note is : " + oldNote.substr(0, 1)
            wrongNote.attr "class", "wrong"
          else
            wrongNote.attr("class", "").html "Wrong, correct note is : " + oldNote.substr(0, 1)
      return
    ), false
    return

  resetScore: ->
    resetScore.addEventListener "click", ->
      positiveScore = 0
      negativeScore = 0
      $(".positive > p").html positiveScore
      $(".negative > p").html negativeScore
      return

    return

  
  # Added event listener to body element.
  # Then iterated through map and if numbers match keycodes trigger then event.
  # Context of "this" was lost when we created anonymous callback function
  # So with bind(this), this is pointing where it should be.
  keyCodesImplementation: ->
    document.getElementsByTagName("body")[0].addEventListener "keydown", ((e) ->
      for i of keysMap
        keysMap[i].click()  if e.keyCode is Number(i)  if keysMap.hasOwnProperty(i)
      return
    ).bind(this), false
    return
)()
Module.help()
Module.ledger()
Module.newNote()
Module.resetScore()
Module.score()
Module.createKeysMap()
Module.keyCodesImplementation()
