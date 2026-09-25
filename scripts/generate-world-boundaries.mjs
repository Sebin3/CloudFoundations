import fs from 'node:fs'
import path from 'node:path'

const sourceDirectory = path.resolve('node_modules/world-geojson/countries')
const outputFile = path.resolve('public/world-boundaries.json')
const tolerance = 0.16

function squaredDistance([x, y], [x1, y1]) {
  return (x - x1) ** 2 + (y - y1) ** 2
}

function squaredSegmentDistance(point, start, end) {
  let x = start[0]
  let y = start[1]
  let dx = end[0] - x
  let dy = end[1] - y

  if (dx !== 0 || dy !== 0) {
    const projection = ((point[0] - x) * dx + (point[1] - y) * dy) / (dx * dx + dy * dy)
    if (projection > 1) {
      x = end[0]
      y = end[1]
    } else if (projection > 0) {
      x += dx * projection
      y += dy * projection
    }
  }

  dx = point[0] - x
  dy = point[1] - y
  return dx * dx + dy * dy
}

function simplifyLine(points, toleranceValue) {
  if (points.length <= 2) return points

  const squaredTolerance = toleranceValue ** 2
  const keep = new Uint8Array(points.length)
  keep[0] = 1
  keep[points.length - 1] = 1

  function simplify(start, end) {
    let maximumDistance = squaredTolerance
    let index = 0

    for (let current = start + 1; current < end; current += 1) {
      const distance = squaredSegmentDistance(points[current], points[start], points[end])
      if (distance > maximumDistance) {
        index = current
        maximumDistance = distance
      }
    }

    if (maximumDistance > squaredTolerance) {
      keep[index] = 1
      simplify(start, index)
      simplify(index, end)
    }
  }

  simplify(0, points.length - 1)
  return points.filter((_, index) => keep[index] === 1)
}

function roundPoint([longitude, latitude]) {
  return [Number(longitude.toFixed(3)), Number(latitude.toFixed(3))]
}

function simplifyGeometry(geometry) {
  if (geometry.type === 'Polygon') {
    return { ...geometry, coordinates: geometry.coordinates.map((ring) => simplifyLine(ring, tolerance).map(roundPoint)) }
  }

  return { ...geometry, coordinates: geometry.coordinates.map((polygon) => polygon.map((ring) => simplifyLine(ring, tolerance).map(roundPoint))) }
}

const features = fs.readdirSync(sourceDirectory)
  .filter((fileName) => fileName.endsWith('.json'))
  .map((fileName) => {
    const source = JSON.parse(fs.readFileSync(path.join(sourceDirectory, fileName), 'utf8'))
    const country = fileName.replace(/\.json$/, '')
    return source.features.map((feature) => ({
      type: 'Feature',
      properties: { country },
      geometry: simplifyGeometry(feature.geometry),
    }))
  })
  .flat()

fs.writeFileSync(outputFile, `${JSON.stringify({ type: 'FeatureCollection', features })}\n`)
console.log(`Generated ${features.length} features in ${outputFile}`)
