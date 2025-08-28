import { Howl } from 'howler'
let cache = {}
export function playSfx(name){
  if(!cache[name]){
    const src = { click:'/sfx/click.mp3', success:'/sfx/success.mp3', confetti:'/sfx/confetti.mp3' }[name]
    if(!src) return; cache[name] = new Howl({src:[src], volume:0.3})
  }
  cache[name].play()
}