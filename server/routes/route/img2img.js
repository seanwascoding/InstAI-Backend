const express = require('express')
const axios = require('axios')
const fs = require('fs')
const router = express.Router()

//* middleware
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    console.log(req.method, req.url)
    next()
})

//* send to img2img api (stable diffusion)
//TODO edit request to requestData
router.get('/process', async (req, res) => {
    try {
        //! read image from directory & send json(request) to stable diffusion
        fs.readFile('./images/dog.png', { encoding: 'base64' }, async (err, data) => {
            if (err) {
                console.log(err)
                return res.status(500).send('error')
            }
            const requestData =
            {
                // main argument
                "init_images": [data],
                "prompt": "a dog, beach background, blue sky",
                "negative_prompt": "",
                "resize_mode": 1,
                "denoising_strength": 0.6,
                "inpaint_full_res": true,
                "inpaint_full_res_padding": 0,
                "inpainting_mask_invert": 0,
                "initial_noise_multiplier": 0,
                "styles": [],
                "seed": -1,
                "batch_size": 1,
                "n_iter": 1,
                "steps": 50,
                "cfg_scale": 7,
                "width": 1040,
                "height": 585,
                "restore_faces": false,
                "mask_blur": 10,
                "tiling": false,
                "eta": 0,
                "sampler_index": "DPM++ 2M Karras",
                "alwayson_scripts": "",

                // setup argument
                "override_settings": {
                    "sd_model_checkpoint": "v1-5-pruned-emaonly.ckpt"
                },
                "send_images": true,
                "save_images": false,
                "include_init_images": false,
            }
            //? send json(request) to stable diffusion
            axios.post('http://127.0.0.1:7860/sdapi/v1/img2img', requestData, { timeout: 1000000 * 10 ^ 3 })
                .then(reponse => {
                    const data_image = reponse.data.images[0]
                    res.status(200).json(data_image)
                })
                .catch(error => {
                    console.log(error)
                    res.status(500).send("error")
                })
        })
    } catch (err) {
        console.log(err)
        res.status(500).send("error")
    }

})

module.exports = { router }