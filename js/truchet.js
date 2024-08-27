import { ref } from 'vue'

const TOTAL_TILES = 23
const MAX_ROW_SIZE = 5
const NUM_ROWS = (TOTAL_TILES - MAX_ROW_SIZE) / (2 * MAX_ROW_SIZE - 1) * 2 + 1

class Tile {
    static SVG_ID_FOR_TYPE = ['A', 'B', 'C']
    static ROTATION_AMOUNT_DEG = 60

    constructor(type = 0, rotation = 0) {
        this.type = type
        this.rotation = rotation % 360
    }

    rotate() {
        this.rotation = (this.rotation + Tile.ROTATION_AMOUNT_DEG) % 360
        return this
    }

    changeType() {
        this.type = (this.type + 1) % Tile.SVG_ID_FOR_TYPE.length
        return this
    }

    get id() {
        return `${this.type}${this.rotation / Tile.ROTATION_AMOUNT_DEG}`
    }

    get src() {
        return `/media/truchet-spikey.svg#${Tile.SVG_ID_FOR_TYPE[this.type]}`
    }

}

export default {
    setup() {
        console.log({
            NUM_ROWS
        })

        const tiles = ref(
            Array.from(
                { length: NUM_ROWS },
                (_, n) => Array.from(
                    { length: n % 2 === 1 ? MAX_ROW_SIZE - 1 : MAX_ROW_SIZE }, 
                    () => (new Tile())
                ),
            )
        )

        const bump = (event, tile) => {
            if (event.shiftKey) {
                tile.changeType()
            } else {
                tile.rotate()
            }
            console.log(tile.id)
        }

        return { tiles, bump }
    },
    template: `
        <div 
            v-for="row in tiles"
            class="truchet-row"
        >
            <svg 
                v-for="tile in row" 
                @click="bump($event, tile)" 
                viewbox="0 0 84 96" width="84" height="96" 
                class="truchet-tile" :tile-rotate="tile.rotation"
            >
                <use :xlink:href="tile.src"></use>
            </svg>
        </div>
    `
}
