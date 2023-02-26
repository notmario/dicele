// url params
const urlParams = new URLSearchParams(window.location.search);

let eqCount = 4;
if (urlParams.has('eqc')) {
  eqCount = parseInt(urlParams.get('eqc'))
}

// select eqc
if (eqCount == 2) document.querySelector(".two").classList.add("selected")
if (eqCount == 4) document.querySelector(".four").classList.add("selected")
if (eqCount == 6) document.querySelector(".six").classList.add("selected")
if (eqCount == 8) document.querySelector(".eight").classList.add("selected")

let useDailySeed = true
if (urlParams.has('random')) {
  useDailySeed = false
  document.querySelector(".randomtoggle").innerHTML = "daily"
  document.querySelector(".randomtoggle").href = "./"
  if (eqCount != 4) document.querySelector(".randomtoggle").href += "?eqc=" + eqCount

  if (eqCount != 2) document.querySelector(".two").href = "./?random&eqc=2"
  if (eqCount != 4) document.querySelector(".four").href = "./?random"
  if (eqCount != 6) document.querySelector(".six").href = "./?random&eqc=6"
  if (eqCount != 8) document.querySelector(".eight").href = "./?random&eqc=8"
} else {
  document.querySelector(".randomtoggle").innerHTML = "random"
  document.querySelector(".randomtoggle").href = "./?random"
  if (eqCount != 4) document.querySelector(".randomtoggle").href += "&eqc=" + eqCount

  if (eqCount != 2) document.querySelector(".two").href = "./?eqc=2"
  if (eqCount != 4) document.querySelector(".four").href = "./"
  if (eqCount != 6) document.querySelector(".six").href = "./?eqc=6"
  if (eqCount != 8) document.querySelector(".eight").href = "./?eqc=8"
}

const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
const firstDate = new Date(2023, 1, 25);
const secondDate = new Date();
const diffDays = Math.floor(Math.abs((firstDate - secondDate) / oneDay));

if (useDailySeed) document.querySelector("h1").innerHTML = `dicele ${diffDays}`


let equipment = {
  "bump": {
    "name": "Bump",
    "color": "green",
    "slots": ["NORMAL"],
    "description": "Dice value +1",
    "onUse": (d, otherdice) => {
      d[0] = d[0] + 1
      if (d[0] > 6) {
        d[0] = 6
        otherdice.push(d[0])
        otherdice.push(1)
      } else
      otherdice.push(d[0])
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = []
      for (let i = 2; i < 7; i++) {
        if (mydice.includes(i)) {
          let move = {
            "equipment": "bump",
            "before": mydice.slice(),
            "used": [i - 1],
            "after": mydice.slice()
          }
          move.before[move.before.indexOf(i)] = i - 1
          moves.push(move)
        }

      }
      // if we have a six and a one
      if (mydice.includes(6) && mydice.includes(1)) {
        let move = {
          "equipment": "bump",
          "before": mydice.slice(),
          "used": [6],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(1), 1)
        moves.push(move)
      }

      return moves
    }
  },
  "spanner": {
    "name": "Spanner",
    "color": "green",
    "slots": ["NORMAL","NORMAL"],
    "description": "Combine the dice",
    "onUse": (d, otherdice) => {
      let sum = 0
      for (let i = 0; i < d.length; i++) {
        sum += d[i]
      }
      if (sum > 6) {
        otherdice.push(6)
        otherdice.push(sum - 6)
      } else
      otherdice.push(sum)
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = []
      for (let i = 2; i < 7; i++) {
        if (mydice.includes(i)) {
          // possible combinations to combine to i
          for (let j = 1; j <= Math.floor(i/2); j++) {
            let move = {
              "equipment": "spanner",
              "before": mydice.slice(),
              "used": [j, i-j],
              "after": mydice.slice()
            }
            move.before.splice(move.before.indexOf(i), 1)
            move.before.push(j)
            move.before.push(i - j)

            moves.push(move)
          }
        }
      }
      if (mydice.includes(6)) {
        // over 6
        for (let j = 2; j <= 5; j++) {
          if (mydice.includes(j)) {
            // total is 6+j
            for (let k = 1; k <= Math.floor((6+j)/2); k++) {
              if (k >= 6 || (6+j-k) >= 6) continue
              let move = {
                "equipment": "spanner",
                "before": mydice.slice(),
                "used": [k, 6+j-k],
                "after": mydice.slice()
              }
              move.before.splice(move.before.indexOf(6), 1)
              move.before.splice(move.before.indexOf(j), 1)
              move.before.push(k)
              move.before.push(6+j-k)

              moves.push(move)
            }
          }
        }

      }
      return moves
    }
  },
  "nudge": {
    "name": "Nudge",
    "color": "green",
    "slots": ["MIN2"],
    "description": "Dice value -1",
    "onUse": (d, otherdice) => {
      d[0] = d[0] - 1
      if (d[0] < 1) {
      } else
      otherdice.push(d[0])
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = []
      // // could nudge a one out of existence
      // let move = {
      //   "equipment": "nudge",
      //   "before": mydice.slice(),
      //   "used": [1],
      //   "after": mydice.slice()
      // }
      // move.before.push(1);
      // moves.push(move)
      for (let i = 1; i < 6; i++) {
        if (mydice.includes(i)) {
          let move = {
            "equipment": "nudge",
            "before": mydice.slice(),
            "used": [i + 1],
            "after": mydice.slice()
          }
          move.before[move.before.indexOf(i)] = i + 1
          moves.push(move)
        }

      }
      return moves
    }
  },
  "vise grip": {
    "name": "Vise Grip",
    "color": "green",
    "slots": ["NORMAL","NORMAL"],
    "description": "Return two of the difference between the dice",
    "onUse": (d, otherdice) => {
      let diff = Math.abs(d[0] - d[1])
      if (diff > 0) {
        otherdice.push(diff)
        otherdice.push(diff)
      }
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = []
      for (let i = 1; i < 6; i++) {
        if (mydice.includes(i)) {
          if (mydice.indexOf(i,mydice.indexOf(i)+1) != -1) {
            // all possible ones which differ by i
            for (let j = 1; j < 7-i; j++) {
              let move = {
                "equipment": "vise grip",
                "before": mydice.slice(),
                "used": [j, i+j],
                "after": mydice.slice()
              }
              move.before.splice(move.before.indexOf(i), 1)
              move.before.splice(move.before.indexOf(i), 1)
              move.before.push(j)
              move.before.push(i+j)

              moves.push(move)
            }
          }
        }
      }
      // actually shelve this for now, it's too common
      // and the doubles turning into nothings
      // i don't like this though? it's too common? how do i make it less common??
      // solution: total
      let tot = (mydice.reduce((a, b) => a + b, 0)%6)+1
      let move = {
        "equipment": "vise grip",
        "before": mydice.slice(),
        "used": [tot, tot],
        "after": mydice.slice()
      }
      move.before.push(tot)
      move.before.push(tot)

      moves.push(move)
      return moves
    }
  },
  "vise grip+": {
    "name": "Vise Grip+",
    "color": "green-upgraded",
    "slots": ["NORMAL","NORMAL"],
    "description": "Return three of the difference between the dice",
    "onUse": (d, otherdice) => {
      let diff = Math.abs(d[0] - d[1])
      if (diff > 0) {
        otherdice.push(diff)
        otherdice.push(diff)
        otherdice.push(diff)
      }
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = []
      for (let i = 1; i < 6; i++) {
        if (mydice.includes(i)) {
          if (mydice.indexOf(i,mydice.indexOf(i)+1) != -1 && mydice.indexOf(i,mydice.indexOf(i,mydice.indexOf(i)+1)+1) != -1) {
            // all possible ones which differ by i
            for (let j = 1; j < 7-i; j++) {
              let move = {
                "equipment": "vise grip+",
                "before": mydice.slice(),
                "used": [j, i+j],
                "after": mydice.slice()
              }
              move.before.splice(move.before.indexOf(i), 1)
              move.before.splice(move.before.indexOf(i), 1)
              move.before.splice(move.before.indexOf(i), 1)
              move.before.push(j)
              move.before.push(i+j)

              moves.push(move)
            }
          }
        }
      }
      // actually shelve this for now, it's too common
      // and the doubles turning into nothings
      // i don't like this though? it's too common? how do i make it less common??
      // solution: total
      let tot = (mydice.reduce((a, b) => a + b, 0)%6)+1
      let move = {
        "equipment": "vise grip+",
        "before": mydice.slice(),
        "used": [tot, tot],
        "after": mydice.slice()
      }
      move.before.push(tot)
      move.before.push(tot)

      moves.push(move)
      return moves
    }
  },
  "doppeldice": {
    "name": "Doppeldice",
    "color": "green",
    "slots": ["MAX3"],
    "description": "Double dice value",
    "onUse": (d, otherdice) => {
      d[0] = d[0] * 2
      if (d[0] > 6) {
        otherdice.push(6)
        otherdice.push(d[0] - 6)
      } else
      otherdice.push(d[0])
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = []
      for (let i = 1; i < 7; i++) {
        if (i % 2 == 1) continue;
        if (mydice.includes(i)) {
          let move = {
            "equipment": "doppeldice",
            "before": mydice.slice(),
            "used": [i / 2],
            "after": mydice.slice()
          }
          move.before[move.before.indexOf(i)] = i / 2
          moves.push(move)
        }
      }
      // if (mydice.includes(6)) {
      //   for (let i = 1; i < 5; i++) {
      //     if (i % 2 == 1) continue;
      //     if (mydice.includes(i)) {
      //       let move = {
      //         "equipment": "doppeldice",
      //         "before": mydice.slice(),
      //         "used": [i / 2 + 3],
      //         "after": mydice.slice()
      //       }
      //       move.before[move.before.indexOf(i)] = i / 2 + 3
      //       move.before.splice(move.before.indexOf(6), 1)
      //       moves.push(move)
      //     }
      //   }
      //   if (mydice.indexOf(6, mydice.indexOf(6) + 1) != -1) {
      //     let move = {
      //       "equipment": "doppeldice",
      //       "before": mydice.slice(),
      //       "used": [6],
      //       "after": mydice.slice()
      //     }
      //     move.before.splice(move.before.indexOf(6), 1)
      //     moves.push(move)
      //   }
      // }
      return moves
    }
  },
  "doppeldice+": {
    "name": "Doppeldice+",
    "color": "green-upgraded",
    "slots": ["NORMAL"],
    "description": "Double dice value",
    "onUse": (d, otherdice) => {
      d[0] = d[0] * 2
      if (d[0] > 6) {
        otherdice.push(6)
        otherdice.push(d[0] - 6)
      } else
      otherdice.push(d[0])
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = []
      for (let i = 1; i < 7; i++) {
        if (i % 2 == 1) continue;
        if (mydice.includes(i)) {
          let move = {
            "equipment": "doppeldice+",
            "before": mydice.slice(),
            "used": [i / 2],
            "after": mydice.slice()
          }
          move.before[move.before.indexOf(i)] = i / 2
          moves.push(move)
        }
      }
      if (mydice.includes(6)) {
        for (let i = 1; i < 5; i++) {
          if (i % 2 == 1) continue;
          if (mydice.includes(i)) {
            let move = {
              "equipment": "doppeldice+",
              "before": mydice.slice(),
              "used": [i / 2 + 3],
              "after": mydice.slice()
            }
            move.before[move.before.indexOf(i)] = i / 2 + 3
            move.before.splice(move.before.indexOf(6), 1)
            moves.push(move)
          }
        }
        if (mydice.indexOf(6, mydice.indexOf(6) + 1) != -1) {
          let move = {
            "equipment": "doppeldice+",
            "before": mydice.slice(),
            "used": [6],
            "after": mydice.slice()
          }
          move.before.splice(move.before.indexOf(6), 1)
          moves.push(move)
        }
      }
      return moves
    }
  },
  "ungeradedice": {
    "name": "Ungeradedice",
    "color": "green",
    "slots": ["MAX5"],
    "description": "Double dice value,<br/>then value -1",
    "onUse": (d, otherdice) => {
      d[0] = d[0] * 2 - 1
      if (d[0] > 6) {
        otherdice.push(6)
        otherdice.push(d[0] - 6)
      } else
      otherdice.push(d[0])
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = []
      for (let i = 2; i < 6; i++) {
        if (i % 2 == 0) continue;
        if (mydice.includes(i)) {
          let move = {
            "equipment": "ungeradedice",
            "before": mydice.slice(),
            "used": [(i+1) / 2],
            "after": mydice.slice()
          }
          move.before[move.before.indexOf(i)] = (i+1) / 2
          moves.push(move)
        }
      }
      if (mydice.includes(6)) {
        for (let i = 1; i < 4; i++) {
          if (i % 2 == 0) continue;
          if (mydice.includes(i)) {
            let move = {
              "equipment": "ungeradedice",
              "before": mydice.slice(),
              "used": [(i+1) / 2 + 3],
              "after": mydice.slice()
            }
            move.before[move.before.indexOf(i)] = (i+1) / 2 + 3
            move.before.splice(move.before.indexOf(6), 1)
            moves.push(move)
          }
        }
      }
      return moves
    }
  },
  "ungeradedice+": {
    "name": "Ungeradedice+",
    "color": "green-upgraded",
    "slots": ["MAX5"],
    "description": "Double dice value,<br/>then value +1",
    "onUse": (d, otherdice) => {
      d[0] = d[0] * 2 + 1
      if (d[0] > 6) {
        otherdice.push(6)
        otherdice.push(d[0] - 6)
      } else
      otherdice.push(d[0])
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = []
      for (let i = 3; i < 6; i++) {
        if (i % 2 == 0) continue;
        if (mydice.includes(i)) {
          let move = {
            "equipment": "ungeradedice+",
            "before": mydice.slice(),
            "used": [(i-1) / 2],
            "after": mydice.slice()
          }
          move.before[move.before.indexOf(i)] = (i-1) / 2
          moves.push(move)
        }
      }
      if (mydice.includes(6)) {
        for (let i = 1; i < 4; i++) {
          if (i % 2 == 0) continue;
          if (mydice.includes(i)) {
            let move = {
              "equipment": "ungeradedice+",
              "before": mydice.slice(),
              "used": [(i-1) / 2 + 3],
              "after": mydice.slice()
            }
            move.before[move.before.indexOf(i)] = (i-1) / 2 + 3
            move.before.splice(move.before.indexOf(6), 1)
            moves.push(move)
          }
        }
      }
      return moves
    }
  },
  "rubber duck": {
    "name": "Rubber Duck",
    "color": "orange",
    "slots": ["ODD"],
    "description": "No effect",
    "onUse": (d, otherdice) => {
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = []
      for (let i = 1; i < 6; i++) {
        if (i%2 == 0) continue;
        let move = {
          "equipment": "rubber duck",
          "before": mydice.slice(),
          "used": [i],
          "after": mydice.slice()
        }
        move.before.push(i)
        moves.push(move)
      }
      return moves
    }
  },
  "rubber duck+": {
    "name": "Rubber Duck+",
    "color": "orange-upgraded",
    "slots": ["NEEDS5"],
    "description": "No effect",
    "onUse": (d, otherdice) => {
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = []
      let move = {
        "equipment": "rubber duck+",
        "before": mydice.slice(),
        "used": [5],
        "after": mydice.slice()
      }
      move.before.push(5)
      moves.push(move)
      return moves
    }
  },
  "spatula": {
    "name": "Spatula",
    "color": "green",
    "slots": ["NORMAL"],
    "description": "Flip the dice",
    "onUse": (d, otherdice) => {
      d[0] = 7 - d[0]
      otherdice.push(d[0])
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = []
      for (let i = 1; i < 7; i++) {
        if (!mydice.includes(i)) continue;
        let move = {
          "equipment": "spatula",
          "before": mydice.slice(),
          "used": [7-i],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(i), 1)
        move.before.push(7 - i)
        moves.push(move)
      }
      return moves
    }
  },
  "master key": {
    "name": "Master Key",
    "color": "green",
    "slots": ["MIN4"],
    "description": "Split dice evenly",
    "onUse": (d, otherdice) => {
      otherdice.push(Math.floor(d[0] / 2))
      otherdice.push(Math.ceil(d[0] / 2))
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = []
      // 2,2
      if (mydice.includes(2) && mydice.indexOf(2, mydice.indexOf(2) + 1) != -1) {
        let move = {
          "equipment": "master key",
          "before": mydice.slice(),
          "used": [4],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(2), 1)
        move.before.splice(move.before.indexOf(2), 1)
        move.before.push(4)
        moves.push(move)
      }
      // 3,3
      if (mydice.includes(3) && mydice.indexOf(3, mydice.indexOf(3) + 1) != -1) {
        let move = {
          "equipment": "master key",
          "before": mydice.slice(),
          "used": [6],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(3), 1)
        move.before.splice(move.before.indexOf(3), 1)
        move.before.push(6)
        moves.push(move)
      }
      // 2,3
      if (mydice.includes(2) && mydice.includes(3)) {
        let move = {
          "equipment": "master key",
          "before": mydice.slice(),
          "used": [5],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(2), 1)
        move.before.splice(move.before.indexOf(3), 1)
        move.before.push(5)
        moves.push(move)
      }

      return moves
    }
  },
  "master key+": {
    "name": "Master Key+",
    "color": "green-upgraded",
    "slots": ["MIN2"],
    "description": "Split dice evenly",
    "onUse": (d, otherdice) => {
      otherdice.push(Math.floor(d[0] / 2))
      otherdice.push(Math.ceil(d[0] / 2))
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = []
      // 2,2
      if (mydice.includes(2) && mydice.indexOf(2, mydice.indexOf(2) + 1) != -1) {
        let move = {
          "equipment": "master key+",
          "before": mydice.slice(),
          "used": [4],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(2), 1)
        move.before.splice(move.before.indexOf(2), 1)
        move.before.push(4)
        moves.push(move)
      }
      // 3,3
      if (mydice.includes(3) && mydice.indexOf(3, mydice.indexOf(3) + 1) != -1) {
        let move = {
          "equipment": "master key+",
          "before": mydice.slice(),
          "used": [6],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(3), 1)
        move.before.splice(move.before.indexOf(3), 1)
        move.before.push(6)
        moves.push(move)
      }
      // 2,3
      if (mydice.includes(2) && mydice.includes(3)) {
        let move = {
          "equipment": "master key+",
          "before": mydice.slice(),
          "used": [5],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(2), 1)
        move.before.splice(move.before.indexOf(3), 1)
        move.before.push(5)
        moves.push(move)
      }
      // 1,1
      if (mydice.includes(1) && mydice.indexOf(1, mydice.indexOf(1) + 1) != -1) {
        let move = {
          "equipment": "master key+",
          "before": mydice.slice(),
          "used": [2],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(1), 1)
        move.before.splice(move.before.indexOf(1), 1)
        move.before.push(2)
        moves.push(move)
      }
      // 1,2
      if (mydice.includes(1) && mydice.includes(2)) {
        let move = {
          "equipment": "master key+",
          "before": mydice.slice(),
          "used": [3],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(1), 1)
        move.before.splice(move.before.indexOf(2), 1)
        move.before.push(3)
        moves.push(move)
      }
      
      return moves
    }
  },
  "chisel": {
    "name": "Chisel",
    "color": "green",
    "slots": ["MIN2"],
    "description": "Dice value -1, roll a 1",
    "onUse": (d, otherdice) => {
      d[0] = Math.max(1, d[0] - 1)
      otherdice.push(d[0])
      otherdice.push(1)
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = [];
      if (!mydice.includes(1)) return [];
      if (mydice.indexOf(1, mydice.indexOf(1) + 1) != -1) {
        let move = {
          "equipment": "chisel",
          "before": mydice.slice(),
          "used": [2],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(1), 1)
        move.before.splice(move.before.indexOf(1), 1)
        move.before.push(2)
        moves.push(move)
      }
      for (let i = 3; i < 7; i++) {
        if (!mydice.includes(i-1)) continue;
        let move = {
          "equipment": "chisel",
          "before": mydice.slice(),
          "used": [i],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(i-1), 1)
        move.before.splice(move.before.indexOf(1), 1)
        move.before.push(i)
        moves.push(move)
      }
      return moves
    }
  },
  "counterfeit": {
    "name": "Counterfeit",
    "color": "green",
    "slots": ["NORMAL"],
    "description": "Duplicate dice",
    "onUse": (d, otherdice) => {
      otherdice.push(d[0])
      otherdice.push(d[0])
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = []
      for (let i = 1; i < 7; i++) {
        if (mydice.indexOf(i, mydice.indexOf(i) + 1) == -1) continue;
        let move = {
          "equipment": "counterfeit",
          "before": mydice.slice(),
          "used": [i],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(i), 1)
        moves.push(move)
      }
      return moves
    }
  },
  "blender": {
    "name": "Blender",
    "color": "green",
    "slots": ["MIN2"],
    "description": "Split a dice into ones",
    "onUse": (d, otherdice) => {
      for (let i = 0; i < d[0]; i++) {
        otherdice.push(1)
      }
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      // count the number of ones we have
      let ones = 0;
      for (let i = 0; i < mydice.length; i++) {
        if (mydice[i] == 1) ones++;
      }
      // if we have less than 2 ones, we can't do anything
      if (ones < 2) return [];
      if (ones >= 6) ones = 6;
      // otherwise, we can generate all possible moves
      let moves = []
      for (let i = 2; i < ones+1; i++) {
        let move = {
          "equipment": "blender",
          "before": mydice.slice(),
          "used": [i],
          "after": mydice.slice()
        }
        for (let j = 0; j < i; j++) {
          move.before.splice(move.before.indexOf(1), 1)
        }
        move.before.push(i)
        moves.push(move)
      }
      return moves
    }
  },
  "hacksaw": {
    "name": "Hacksaw",
    "color": "green",
    "slots": ["MIN3"],
    "description": "Split dice evenly into three",
    "onUse": (d, otherdice) => {
      let split = Math.floor(d[0]/3)
      // check even left
      if (d[0] % 3 == 1) {
        otherdice.push(split+1)
        otherdice.push(split)
        otherdice.push(split)
      }
      // check even right
      else if (d[0] % 3 == 2) {
        otherdice.push(split+1)
        otherdice.push(split+1)
        otherdice.push(split)
      }
      // check even
      else {
        otherdice.push(split)
        otherdice.push(split)
        otherdice.push(split)
      }
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = []
      // 2, 2, 2
      if (mydice.includes(2) && mydice.indexOf(2, mydice.indexOf(2) + 1) != -1 && mydice.indexOf(2, mydice.indexOf(2, mydice.indexOf(2) + 1) + 1) != -1) {
        let move = {
          "equipment": "hacksaw",
          "before": mydice.slice(),
          "used": [6],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(2), 1)
        move.before.splice(move.before.indexOf(2), 1)
        move.before.splice(move.before.indexOf(2), 1)
        move.before.push(6)
        moves.push(move)
      }
      // 2, 2, 1
      if (mydice.includes(2) && mydice.indexOf(2, mydice.indexOf(2) + 1) != -1 && mydice.indexOf(1) != -1) {
        let move = {
          "equipment": "hacksaw",
          "before": mydice.slice(),
          "used": [5],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(2), 1)
        move.before.splice(move.before.indexOf(2), 1)
        move.before.splice(move.before.indexOf(1), 1)
        move.before.push(5)
        moves.push(move)
      }
      // 2, 1, 1
      if (mydice.indexOf(2) != -1 && mydice.includes(1) && mydice.indexOf(1, mydice.indexOf(1) + 1) != -1) {
        let move = {
          "equipment": "hacksaw",
          "before": mydice.slice(),
          "used": [4],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(2), 1)
        move.before.splice(move.before.indexOf(1), 1)
        move.before.splice(move.before.indexOf(1), 1)
        move.before.push(4)
        moves.push(move)
      }
      // 1, 1, 1
      if (mydice.includes(1) && mydice.indexOf(1, mydice.indexOf(1) + 1) != -1 && mydice.indexOf(1, mydice.indexOf(1, mydice.indexOf(1) + 1) + 1) != -1) {
        let move = {
          "equipment": "hacksaw",
          "before": mydice.slice(),
          "used": [3],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(1), 1)
        move.before.splice(move.before.indexOf(1), 1)
        move.before.splice(move.before.indexOf(1), 1)
        move.before.push(3)
        moves.push(move)
      }
      return moves
    }
  },
  "sine wave": {
    "name": "Sine Wave",
    "color": "green",
    "slots": ["DOUBLES","DOUBLES"],
    "description": "First dice value +1,<br/>second dice -1",
    "onUse": (d, otherdice) => {
      if (d[0] == 6) {
        otherdice.push(6)
        otherdice.push(1)
      } else
        otherdice.push(d[0]+1)
      if (d[1] > 1)
        otherdice.push(d[1]-1)
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = [];
      // dice different by 2
      for (let i = 1; i < 5; i++) {
        if (mydice.includes(i) && mydice.includes(i+2)) {
          let move = {
            "equipment": "sine wave",
            "before": mydice.slice(),
            "used": [i+1,i+1],
            "after": mydice.slice()
          }
          move.before.splice(move.before.indexOf(i), 1)
          move.before.splice(move.before.indexOf(i+2), 1)
          move.before.push(i+1)
          move.before.push(i+1)
          moves.push(move)
        }
      }
      // 5,6,1
      if (mydice.includes(5) && mydice.includes(6) && mydice.includes(1)) {
        let move = {
          "equipment": "sine wave",
          "before": mydice.slice(),
          "used": [6,6],
          "after": mydice.slice(),
        }
        move.before.splice(move.before.indexOf(5), 1)
        move.before.splice(move.before.indexOf(6), 1)
        move.before.splice(move.before.indexOf(1), 1)
        move.before.push(6)
        move.before.push(6)
        moves.push(move)
      }
      // single 2
      if (mydice.includes(2)) {
        let move = {
          "equipment": "sine wave",
          "before": mydice.slice(),
          "used": [1,1],
          "after": mydice.slice(),
        }
        move.before.splice(move.before.indexOf(2), 1)
        move.before.push(1)
        move.before.push(1)
        moves.push(move)
      }
      return moves;
    }
  },
  "sine wave+": {
    "name": "Sine Wave+",
    "color": "green-upgraded",
    "slots": ["DOUBLES","DOUBLES"],
    "description": "Both dice values +1",
    "onUse": (d, otherdice) => {
      if (d[0] == 6) {
        otherdice.push(6)
        otherdice.push(1)
      } else
        otherdice.push(d[0]+1)
      if (d[1] == 6) {
        otherdice.push(6)
        otherdice.push(1)
      } else
        otherdice.push(d[1]+1)

      return otherdice
    },
    "genReverseMoves": (mydice) => {
      let moves = [];
      // matching dice
      for (let i = 2; i < 7; i++) {
        if (mydice.includes(i) && mydice.indexOf(i) != mydice.lastIndexOf(i)) {
          let move = {
            "equipment": "sine wave+",
            "before": mydice.slice(),
            "used": [i-1,i-1],
            "after": mydice.slice()
          }
          move.before.splice(move.before.indexOf(i), 1)
          move.before.splice(move.before.indexOf(i), 1)
          move.before.push(i-1)
          move.before.push(i-1)
          moves.push(move)
        }
      }
      // also 6161
      if (mydice.includes(6) && mydice.includes(1) && mydice.indexOf(6) != mydice.lastIndexOf(6) && mydice.indexOf(1) != mydice.lastIndexOf(1)) {
        let move = {
          "equipment": "sine wave+",
          "before": mydice.slice(),
          "used": [6,6],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(6), 1)
        move.before.splice(move.before.indexOf(6), 1)
        move.before.splice(move.before.indexOf(1), 1)
        move.before.splice(move.before.indexOf(1), 1)
        move.before.push(6)
        move.before.push(6)
        moves.push(move)
      }
      return moves;
    }
  },
  // "giant spatula": {
  //   "name": "Giant Spatula",
  //   "color": "green",
  //   "slots": ["NORMAL"],
  //   "description": "Flip all your dice upside down",
  //   "onUse": (d, otherdice) => {
  //     otherdice = otherdice.map((x) => 7-x)
  //     return otherdice
  //   },
  //   "genReverseMoves": (mydice) => {
  //     // this is like visegrip with two matching ones, want it to be rare
  //     let moves = [];
  //     let tot = (mydice.reduce((a, b) => a + b, 0)%6)+1
  //     let move = {
  //       "equipment": "giant spatula",
  //       "before": mydice.slice(),
  //       "used": [tot],
  //       "after": mydice.slice()
  //     }
  //     move.before = move.before.map((x) => 7-x)
  //     move.before.push(tot)

  //     moves.push(move)
  //     return moves
  //   }
  // }
  "bumpbomb": {
    "name": "Bumpbomb",
    "color": "green",
    "slots": ["NEEDS6"],
    "description": "All other dice +1",
    "onUse": (d, otherdice) => {
      let extraOnes = 0;
      for (let i = 0; i < otherdice.length; i++) {
        if (otherdice[i] == 6) {
          extraOnes += 1
        } else {
          otherdice[i] += 1
        }
      }
      for (let i = 0; i < extraOnes; i++) {
        otherdice.push(1)
      }
    },
    "genReverseMoves": (mydice) => {
      let moves = [];
      // if we have more 6s than ones
      if (mydice.filter(x => x == 6).length >= mydice.filter(x => x == 1).length) {
        let move = {
          "equipment": "bumpbomb",
          "before": mydice.slice(),
          "used": [6],
          "after": mydice.slice()
        }
        let newarr = [];
        let sorted = move.before.slice().sort((a, b) => a - b)
        for (let i = 0; i < sorted.length; i++) {
          // skip ones and sixes for now
          if (sorted[i] == 1 || sorted[i] == 6) continue;
          // nudge all other dice
          newarr.push(sorted[i]-1)

        }
        // sixes and ones are handled separately
        let sixCount = sorted.filter(x => x == 6).length
        let oneCount = sorted.filter(x => x == 1).length

        // for sixes with ones, we just put a six in
        for (let i = 0; i < oneCount; i++) {
          newarr.push(6)
        }
        // for sixes without ones, we put a five in
        for (let i = 0; i < sixCount - oneCount; i++) {
          newarr.push(5)
        }
        // and the six that we used
        newarr.push(6)
        move.before = newarr
        moves.push(move)
      }
      return moves
    }
  },
  "allen key": {
    "name": "Allen Key",
    "color": "green",
    "slots": ["TOTAL6", "TOTAL6"],
    "description": "Combine the dice",
    "onUse": (d, otherdice) => {
      otherdice.push(6);
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      // if we have a 6, we can use it to combine two dice
      let moves = [];
      if (mydice.includes(6)) {
        for (let i = 1; i < 4; i++) {
          let move = {
            "equipment": "allen key",
            "before": mydice.slice(),
            "used": [i, 6-i],
            "after": mydice.slice()
          }
          move.before.splice(move.before.indexOf(6), 1)
          move.before.push(i)
          move.before.push(6-i)
          moves.push(move)
        }
      }
      return moves;
    }
  },
  "allen key+": {
    "name": "Allen Key+",
    "color": "green-upgraded",
    "slots": ["TOTAL9", "TOTAL9"],
    "description": "Combine the dice",
    "onUse": (d, otherdice) => {
      otherdice.push(6);
      otherdice.push(3);
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      // if we have a 6, we can use it to combine two dice
      let moves = [];
      if (mydice.includes(6) && mydice.includes(3)) {
        // 4 and 5
        let move = {
          "equipment": "allen key+",
          "before": mydice.slice(),
          "used": [4, 5],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(6), 1)
        move.before.splice(move.before.indexOf(3), 1)
        move.before.push(4)
        move.before.push(5)
        moves.push(move)
      }
      return moves;
    }
  },
  "saw wave": {
    "name": "Saw Wave",
    "color": "green",
    "slots": ["TOTAL7", "TOTAL7"],
    "description": "Roll a 6 and a 1",
    "onUse": (d, otherdice) => {
      otherdice.push(6);
      otherdice.push(1);
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      // if we have a 6, we can use it to combine two dice
      let moves = [];
      if (mydice.includes(6) && mydice.includes(1)) {
        for (let i = 2; i < 4; i++) {
          let move = {
            "equipment": "saw wave",
            "before": mydice.slice(),
            "used": [i, 7-i],
            "after": mydice.slice()
          }
          move.before.splice(move.before.indexOf(6), 1)
          move.before.splice(move.before.indexOf(1), 1)
          move.before.push(i)
          move.before.push(7-i)
          moves.push(move)
        }
      }
      return moves;
    }
  },
  "splitula": {
    "name": "Splitula",
    "color": "green",
    "slots": ["MIN4"],
    "description": "Flip the dice, and<br/>then duplicate it",
    "onUse": (d, otherdice) => {
      otherdice.push(7-d);
      otherdice.push(7-d);
      return otherdice
    },
    "genReverseMoves": (mydice) => {
      // if we have a 6, we can use it to combine two dice
      let moves = [];
      for (let i = 1; i < 4; i++) {
        if (!(mydice.includes(i) && mydice.indexOf(i) !== mydice.lastIndexOf(i))) continue;
        let move = {
          "equipment": "splitula",
          "before": mydice.slice(),
          "used": [7-i],
          "after": mydice.slice()
        }
        move.before.splice(move.before.indexOf(i), 1)
        move.before.splice(move.before.indexOf(i), 1)
        move.before.push(7-i)
        moves.push(move)
      }
      return moves;
    }
  }
}

let globalSeed = Math.floor(Math.random()*2**32-1)

// seed url
if (urlParams.has("seed")) {
  globalSeed = urlParams.get("seed")
}

let generatePuzzle = (count, seeded)=> {
  // seeded random based on current day
  let seed = 37 + diffDays * 11 + eqCount * 29
  seed = seed * 78374872834 - 32
  seed = seed % 2**32-1
  seed = seed * 7823872834 - 32
  seed = seed % 2**32-1
  seed = seed * 72834 - 32
  seed = seed % 2**32-1
  seed = seed * 2232 - 32
  seed = seed % 2**32-1

  if (seeded) Math.seedrandom(seed)
  else Math.seedrandom(globalSeed)

  let dice = [1,2,3,4,5,6];

  let realMoves = [];

  for (let i = 0; i < count; i++) {
    // generate all possible reverse moves
    let moves = [];
    for (let eq in equipment) {
      moves = moves.concat(equipment[eq].genReverseMoves(dice.slice()))
    }
    // console.log("===")
    // for (let move in moves) {
    //   // check if the move is valid
    //   console.log(moves[move].equipment+"@"+moves[move].before.join(",")+"->"+moves[move].after.join(","))
    // }
    // we need to remove moves with dice states that we already have
    moves = moves.filter(move => 
      !realMoves.map(move => move.after.sort((a,b) => (a-b)).join("")).includes(move.before.sort((a,b) => (a-b)).join(""))
    )
    consmoves = moves.filter(move => move.before.length < 9-i)
    if (consmoves.length == 0) {
      // well shit. 
      // pick the move with the fewest dice
      consmoves = moves.sort((a,b) => a.before.length - b.before.length)
      consmoves = consmoves.filter(move => move.before.length == consmoves[0].before.length)
      // consmoves = moves.slice()
    }
    if (i===0) {
      // debug mode
      // consmoves = moves.filter(move => move.equipment === "saw wave")
    }
    // pick a random move
    let move = consmoves[Math.floor(Math.random() * consmoves.length)]

    realMoves.unshift(move)
    // apply the move
    dice = move.before.sort((a,b) => a-b)
  }

  for (move in realMoves) {
    // console.log(
    //   realMoves[move].before.join("") + " " + 
    //   realMoves[move].equipment + "@" + 
    //   realMoves[move].used.join("") + " -> " + 
    //   realMoves[move].after.sort((a,b) => a-b).join("")
    // )
  }

  return [realMoves, dice]
}

let [realMoves,dice] = generatePuzzle(eqCount, useDailySeed)
let movesMade = [];

let eq = realMoves.map(move => move.equipment)
eq = eq.sort((a,b) => a>b)
realMoves = "nice try"; // no peeking!

let reset = () => {
  [realMoves,dice] = generatePuzzle(eqCount, useDailySeed)
  eq = realMoves.map(move => move.equipment)
  eq = eq.sort((a,b) => a>b)
  realMoves = "nice try"; // no peeking!
  movesMade = [];
}

let eqdiv = document.querySelector(".equipment")

let selectedEq = null;
let selectedDice = [];

let render = ()=>{
  eqdiv.innerHTML = ""
  for (let i = 0; i < eq.length; i++) {
    if (eq[i] === null) {
      let div = document.createElement("div")
      div.classList.add("eq")
      div.classList.add("hidden")

      eqdiv.appendChild(div)

      continue;
    }
    let div = document.createElement("div")
    div.classList.add("eq")
    div.classList.add(equipment[eq[i]].color)

    // add h1 with name
    let h2 = document.createElement("h2")
    h2.innerHTML = equipment[eq[i]].name
    div.appendChild(h2)

    // slots array
    let slots = document.createElement("div")
    slots.classList.add("slots")
    for (let j = 0; j < equipment[eq[i]].slots.length; j++) {
      let slot = document.createElement("div")
      slot.classList.add("slot")
      slots.appendChild(slot)
      if (equipment[eq[i]].slots[j] !== "NORMAL" && equipment[eq[i]].slots[j] !== "DOUBLES" && equipment[eq[i]].slots[j].indexOf("TOTAL") === -1) {
        slot.innerHTML = equipment[eq[i]].slots[j]
      }
      if (j === 0 && equipment[eq[i]].slots[j] === "DOUBLES") {
        slot.classList.add("doubles")
      }
    }
    div.appendChild(slots)
    // total 
    if (equipment[eq[i]].slots[0].indexOf("TOTAL") !== -1) {
      let total = document.createElement("div")
      total.classList.add("total")
      total.innerHTML = "MUST EQUAL "+equipment[eq[i]].slots[0].split("TOTAL")[1]
      div.appendChild(total)
    }

    // add p with description
    let p = document.createElement("p")
    p.innerHTML = equipment[eq[i]].description
    div.appendChild(p)

    eqdiv.appendChild(div)

    div.addEventListener("click", () => {
      if (selectedEq == i) {
        selectedEq = null
        div.classList.remove("selected")
      } else {
        selectedEq = i
        for (let j = 0; j < eqdiv.children.length; j++) {
          eqdiv.children[j].classList.remove("selected")
        }
        div.classList.add("selected")
        // check if we have dice selected
        if (selectedDice.length > 0) {
          // check if we can use the equipment
          if (selectedDice.length !== equipment[eq[i]].slots.length) {
            // we can't, clear out the dice
            selectedDice = []
            for (let j = 0; j < diceDiv.children.length; j++) {
              diceDiv.children[j].classList.remove("selected")
            }
            return;
          }
          // check slots
          let slots = equipment[eq[i]].slots
          for (d in selectedDice) {

            // check if we have a slot for the dice
            let slot = slots[d];
            if (slot === "NORMAL" || slot === "DOUBLES" || slot.indexOf("TOTAL") !== -1)
              continue;

            if (slot === "EVEN")
              if (dice[selectedDice[d]] % 2 == 0)
                continue;

            if (slot === "ODD")
              if (dice[selectedDice[d]] % 2 == 1)
                continue;

            if (slot === "MAX3")
              if (dice[selectedDice[d]] <= 3)
                continue;

            if (slot === "MAX5")
              if (dice[selectedDice[d]] <= 5)
                continue;

            if (slot === "MIN2")
              if (dice[selectedDice[d]] >= 2)
                continue;

            if (slot === "MIN3")
              if (dice[selectedDice[d]] >= 3)
                continue;

            if (slot === "MIN4")
              if (dice[selectedDice[d]] >= 4)
                continue;

            if (slot === "NEEDS5")
              if (dice[selectedDice[d]] === 5)
                continue;

            if (slot === "NEEDS6")
              if (dice[selectedDice[d]] === 6)
                continue;


            // we don't have a slot for the dice
            // clear out the dice
            selectedDice = []
            for (let j = 0; j < diceDiv.children.length; j++) {
              diceDiv.children[j].classList.remove("selected")
            }
            return;
          }
          // doubles check
          if (slots.includes("DOUBLES")) {
            let doubles = 0;
            for (d in selectedDice) {
              if (dice[selectedDice[d]] === dice[selectedDice[0]])
                doubles++;
            }
            if (doubles !== 2) {
              // clear out the dice
              selectedDice = []
              for (let j = 0; j < diceDiv.children.length; j++) {
                diceDiv.children[j].classList.remove("selected")
              }
              return;
            }
          }
          // needs total check
          if (slots[0].indexOf("TOTAL") !== -1) {
            let total = 0;
            for (d in selectedDice) {
              total += dice[selectedDice[d]]
            }
            if (total !== parseInt(slots[0].split("TOTAL")[1])) {
              // clear out the dice
              selectedDice = []
              for (let j = 0; j < diceDiv.children.length; j++) {
                diceDiv.children[j].classList.remove("selected")
              }
              return;
            }
          }
          // we can use the equipment
          let used = selectedDice.map(i => dice[i])
          
          movesMade.push({
            equipment: eq[i],
            used: used.slice(),
            before: dice.slice(),
            after: dice.slice()
          })

          dice = dice.filter((_,i) => !selectedDice.includes(i));
          
          equipment[eq[selectedEq]].onUse(used, dice)
          // dice = dice.sort((a,b) => a-b)
          movesMade[movesMade.length-1].after = dice.slice()
          eq[selectedEq] = null
          selectedEq = null
          selectedDice = []
          render()
        }
      }
    })
  }

  // dice
  let diceDiv = document.querySelector(".dice")
  diceDiv.innerHTML = ""
  // sort dice button
  let s = document.createElement("div")
  s.classList.add("reset")
  s.innerHTML = "↹"
  s.addEventListener("click", () => {
    dice = dice.sort((a,b) => a-b)
    render()
  })
  diceDiv.appendChild(s)
  
  for (let i = 0; i < dice.length; i++) {
    let div = document.createElement("div")
    div.classList.add("die")
    div.innerHTML = dice[i]
    diceDiv.appendChild(div)

    div.addEventListener("click", () => {
      if (selectedEq == null) {
        if (selectedDice.includes(i)) {
          selectedDice.splice(selectedDice.indexOf(i), 1)
          div.classList.remove("selected")
        } else {
          selectedDice.push(i)
          div.classList.add("selected")
        }
        return;
      }

      if (selectedDice.includes(i)) {
        selectedDice.splice(selectedDice.indexOf(i), 1)
        div.classList.remove("selected")
      } else {
        // check slot
        if (selectedDice.length >= equipment[eq[selectedEq]].slots.length) return;
        // max5, max3, all that
        if (equipment[eq[selectedEq]].slots[selectedDice.length] == "MAX5" && dice[i] > 5) return;
        if (equipment[eq[selectedEq]].slots[selectedDice.length] == "MAX3" && dice[i] > 3) return;
        if (equipment[eq[selectedEq]].slots[selectedDice.length] == "ODD" && dice[i] % 2 == 0) return;
        if (equipment[eq[selectedEq]].slots[selectedDice.length] == "EVEN" && dice[i] % 2 == 1) return;
        if (equipment[eq[selectedEq]].slots[selectedDice.length] == "MIN2" && dice[i] == 1) return;
        if (equipment[eq[selectedEq]].slots[selectedDice.length] == "MIN3" && dice[i] < 3) return;
        if (equipment[eq[selectedEq]].slots[selectedDice.length] == "MIN4" && dice[i] < 4) return;
        if (equipment[eq[selectedEq]].slots[selectedDice.length] == "NEEDS5" && dice[i] != 5) return;
        if (equipment[eq[selectedEq]].slots[selectedDice.length] == "NEEDS6" && dice[i] != 6) return;

        // doubles
        if (equipment[eq[selectedEq]].slots[selectedDice.length] == "DOUBLES") {
          if (selectedDice.length > 0) {
            if (dice[selectedDice[0]] != dice[i]) return;
          }
        }

        selectedDice.push(i)
        div.classList.add("selected")
      }
      if (selectedDice.length == equipment[eq[selectedEq]].slots.length && selectedDice.length > 0) {
        // needs total check
        if (equipment[eq[selectedEq]].slots[0].indexOf("TOTAL") !== -1) {
          let total = 0;
          for (d in selectedDice) {
            total += dice[selectedDice[d]]
          }
          if (total !== parseInt(equipment[eq[selectedEq]].slots[0].split("TOTAL")[1])) {
            // clear out the dice
            selectedDice = []
            for (let j = 0; j < diceDiv.children.length; j++) {
              diceDiv.children[j].classList.remove("selected")
            }
            return;
          }
        }
      }
      // if we have all the dice we need, apply the move
      if (selectedDice.length == equipment[eq[selectedEq]].slots.length) {
        let used = selectedDice.map(i => dice[i])
        movesMade.push({
          equipment: eq[i],
          used: used.slice(),
          before: dice.slice(),
          after: dice.slice()
        })
        dice = dice.filter((_,i) => !selectedDice.includes(i));
        
        equipment[eq[selectedEq]].onUse(used, dice)
        // dice = dice.sort((a,b) => a-b)
        movesMade[movesMade.length-1].after = dice.slice()
        // dice = dice.sort((a,b) => a-b)
        eq[selectedEq] = null
        selectedEq = null
        selectedDice = []
        render()
      }
    })
  }
  // reset button
  // in dice div
  let r = document.createElement("div")
  r.classList.add("reset")
  r.innerHTML = "⟳"
  r.addEventListener("click", () => {
    reset()
    render()
  })
  diceDiv.appendChild(r)

  // check win con
  if (dice.length == 6 && eq.every(i => i == null)) {
    // check if 123456
    let win = true
    for (let i = 0; i < dice.length; i++) {
      if (dice.sort((a,b)=>a-b)[i] !== i+1) {
        win = false
        break;
      }
    }
    if (win) {
      document.body.classList.add("win")
    } else {
      document.body.classList.remove("win")
    }
  } else {
    document.body.classList.remove("win")
  }

}
render()

// copy solution button
document.querySelector(".nospoiler").addEventListener("click", () => {
  let s = ""

  s += "dicele"
  if (!useDailySeed) s += "@"+globalSeed
  if (useDailySeed) s += " "+diffDays
  if (eqCount != 4) s += "@"+eqCount+"eq"
  s += "\n";
  s += movesMade[0].before.sort((a,b)=>a-b).join("");
  for (let i = 0; i < movesMade.length; i++) {
    let m = movesMade[i]
    s += "\n-> " + m.equipment + "@" + m.used.join("") + " > " + m.after.sort((a,b)=>a-b).join("");
  }
  s += "\nplay it here! https://dicele.netlify.app/"
  if (!useDailySeed) s += "?seed="+globalSeed
  if (eqCount != 4) {
    if (useDailySeed) s += "?"
    else s += "&"
    s += "eq="+eqCount
  }
  navigator.clipboard.writeText(s)
  alert("Copied to clipboard!")
})

document.querySelector(".spoiler").addEventListener("click", () => {
  let s = ""

  s += "dicele"
  if (!useDailySeed) s += "@"+globalSeed
  if (useDailySeed) s += " "+diffDays
  if (eqCount != 4) s += "@"+eqCount+"eq"
  s += "\n";
  s += movesMade[0].before.sort((a,b)=>a-b).join("");
  for (let i = 0; i < movesMade.length; i++) {
    let m = movesMade[i]
    s += "\n||-> " + m.equipment + "@" + m.used.join("") + " > " + m.after.sort((a,b)=>a-b).join("")+"||";
  }
  s += "\nplay it here! https://dicele.netlify.app/"
  if (!useDailySeed) s += "?seed="+globalSeed
  if (eqCount != 4) {
    if (useDailySeed) s += "?"
    else s += "&"
    s += "eq="+eqCount
  }
  navigator.clipboard.writeText(s)
  alert("Copied to clipboard!")
})