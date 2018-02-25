<template>
    <section>
        <div>
            主界面滑动图片</div>
        <el-upload action="http://upload.qiniup.com" :file-list=main_banners list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleBannerRemove" :data="postData" :on-success="handleBannerSuccess">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="previewImageUrl" alt="">
        </el-dialog>

        <div></div>
        <el-button @click="save" type="primary">保存</el-button>
        <el-button @click="cancel">取消</el-button>
    </section>
</template>

<script>
import base_image_url from '../../common/js/base_url'
import axios from 'axios';
export default {
    data() {
        return {
            previewImageUrl: '',
            dialogVisible: false,
            main_banners: [],
            villas: [],
            postData: {
                token: '93L43E91oA1cbC9k40ZK2eSeOCqxxjJz1SsL4NGv:AKd2pGlo_zch4BJBLr5wsWZLV5Y=:eyJzY29wZSI6IjUxYmllc2h1IiwiZGVhZGxpbmUiOjE1NTM1MTIwMDJ9'
            },
        }
    },
    methods: {
        handlePictureCardPreview(file) {
            this.previewImageUrl = file.url
            this.dialogVisible = true
        },
        handleBannerSuccess(res) {
            var imgurl = base_image_url + res.key
            var dic = {}
            dic.url = imgurl
            this.main_banners.push(dic)
            this.villas.push("")
        },
        handleBannerRemove(file, fileList) {
            var index = this.main_banners.indexOf(file)
            this.main_banners.splice(index, 1)
            this.villas.splice(index, 1)
        },
        save() {
            var banners = []
            for (var i in this.main_banners) {
                var dic = {}
                dic.picture = this.main_banners[i].url
                banners.push(dic)
            }
            var picture = JSON.stringify(banners)
            this.$http.post("http://118.25.20.50:8000/scavenger/createBanner/", { picture }, { headers: "Content-Type:application/x-www-form-urlencoded" }).then(function(response) {
                console.log(response)
            }).catch(function(error) {
            })
        },
        cancel() {
            this.$router.push({ name: '主页', path: '/table' })
        },
        getBanner() {
            this.$http.get("http://118.25.20.50:8000/scavenger/getAllBanner/", { headers: "Content-Type:application/json" }).then(function(response) {
                console.log(response)
                console.log(response.body[0].fields._picture)
                var pictures = JSON.parse(response.body[0].fields._picture)
                console.log(pictures[0])
                for (var item in pictures) {
                    console.log(pictures[item])
                    var imgurl = pictures[item].picture
                    var dic = {}
                    dic.url = imgurl
                    this.main_banners.push(dic)
                }

            }).catch(function(error) {
                console.log(error)
            })
        },

    },
    mounted() {
        this.getBanner()
    }
}
</script>