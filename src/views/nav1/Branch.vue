<template>
    <section>
        <div>分店信息</div>
        <el-upload action="http://upload.qiniup.com" :file-list=main_banners list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleBannerRemove" :data="postData" :on-success="handleBannerSuccess">
            <i class="el-icon-plus"></i>
        </el-upload>

        <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="previewImageUrl" alt="">
        </el-dialog>
        <div>名字</div>
        <el-input v-for="(item,index) in main_banners" v-model="main_banners[index].name" style="width:150px;"></el-input>
        <div>地址</div>
        <el-input v-for="(item,index) in main_banners" v-model="main_banners[index].address" style="width:150px;"></el-input>
        <div>服务时间</div>
        <el-input v-for="(item,index) in main_banners" v-model="main_banners[index].openingHour" style="width:150px;"></el-input>
        <div></div>
        <el-button @click="save" type="primary">保存</el-button>
        <el-button @click="cancel">取消</el-button>

    </section>
</template>

<script>
import base_image_url from '../../common/js/base_url'
import host from '../../common/js/host'
export default {
    data() {
        return {
            previewImageUrl: '',
            dialogVisible: false,
            main_banners: [],
            villas:[],
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
            for (var i in this.main_banners){
                var dic = {}
                dic.thumbnail = this.main_banners[i].url
                dic.name = this.main_banners[i].name
                dic.address = this.main_banners[i].address
                dic.openingHour = this.main_banners[i].openingHour
                banners.push(dic)
            }
            console.log(banners)
            var para = JSON.stringify(banners)
            console.log(para)
            this.$http.post(host+"createMaintenanceCenter/", para, { headers: "Content-Type:application/json" }).then(function(response) {
                console.log(response)
            }).catch(function(error) {
            })
        },
        cancel() {
            this.$router.push({ name: '主页', path: '/table' })
        },
        getBanner() {
            console.log(host)
            this.$http.get(host+"getAllMaintenanceCenter/", { headers: "Content-Type:application/json" }).then(function(response) {
                console.log(response.body)
                for(var item in response.body){
                    console.log(response.body[item].fields)
                    var object = response.body[item].fields
                    var dic = {}
                    dic.name = object._name
                    dic.address = object._address
                    dic.url = object._thumbnail
                    dic.openingHour = object._openingHour
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