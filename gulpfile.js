const argv = require("yargs").argv
const path = require("path")
const gulp = require("gulp")
const zip = require("gulp-zip")
const del = require("del")
const replace = require("gulp-token-replace")

// Set environment variables
const env = argv.env
if (env === undefined) {
	require("dotenv").config()
} else {
	require("dotenv").config({ path: path.resolve(process.cwd(), env) })
}

const pre_clean = (cb) => {
	return del(["./manifest/package/*.zip", "./temp"])
}

const post_clean = (cb) => {
	return del(["./temp"])
}

const generateManifest = (cb) => {
	return gulp
		.src("./manifest/manifest.json")
		.pipe(
			replace({
				tokens: {
					...process.env,
				},
			}),
		)
		.pipe(gulp.dest("./temp"))
}

const zipTask = (cb) => {
	// Get all png files (icons), json files (resources) but not the manifest.json from /src/manifest
	const filePath = "./temp/manifest.json"
	return (
		gulp
			.src(["./manifest/*.png"])
			// get the manifest from the temp folder
			.pipe(gulp.src(filePath))
			.pipe(zip("teamsTab.zip"))
			.pipe(gulp.dest("./manifest/package"))
	)
}

gulp.task(
	"manifest",
	gulp.series(pre_clean, generateManifest, zipTask, post_clean),
	function (done) {
		console.log("Build completed. Output in manifest folder")
		done()
	},
)
