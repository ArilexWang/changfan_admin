<template>
	<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="别墅名称">
			<el-input v-model="villa.name" style="width:150px;"></el-input>
		</el-form-item>
		<el-form-item label="别墅封面">
			<el-upload action="http://upload.qiniup.com" :show-file-list="false" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleAvatarRemove" :data="postData" :on-success="handleAvatarSuccess">
				<img v-if="villa.avatar" :src="villa.avatar" class="avatar" style="width:148px;height:148px">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
			<el-dialog :visible.sync="dialogVisible" size="tiny">
				<img width="100%" :src="avatarImageUrl" alt="">
			</el-dialog>
		</el-form-item>

		<el-form-item v-if="isCreate" label="所在地区">
			<el-cascader :options="CityInfo" v-model="form.selectedOptions" :change-on-select="true" :clearable="true" :filterable="true" @change="handleChange">
			</el-cascader>
			<span>所选地区：{{myAddressCity}}{{myAddressErae}}{{myAddressMinerae}}</span>
		</el-form-item>

		<el-form-item v-else label="所在地区">
			<el-input v-model="villa.city" style="width:150px;" placeholder=""></el-input>
			<el-input v-model="villa.region" style="width:150px;" placeholder=""></el-input>
		</el-form-item>

		<el-form-item label="折扣">
			<el-switch on-value="true" off-value="false" @change="switchClick" v-model="villa.onDiscount"></el-switch>
		</el-form-item>
		<el-form-item label="折扣力度">
			<el-input v-model="villa.discount" style="width:150px;" placeholder="限时折扣"></el-input>
		</el-form-item>

		<el-form-item label="价目表">
			<span style="margin-right: 35px;">星期一</span>
			<span style="margin-right: 35px;">星期二</span>
			<span style="margin-right: 35px;">星期三</span>
			<span style="margin-right: 35px;">星期四</span>
			<span style="margin-right: 35px;">星期五</span>
			<span style="margin-right: 35px;">星期六</span>
			<span style="margin-right: 35px;">星期天</span>
		</el-form-item>

		<el-form-item label="正常价格">
			<el-input v-for="(item,index) in price_list" v-model="price_list[index]" style="width:80px;"></el-input>
		</el-form-item>

		<el-form-item label="折扣价格">
			<el-input v-for="(item,index) in discount_price_list" v-model="discount_price_list[index]"  style="width:80px;"></el-input>
		</el-form-item>

		<el-form-item label="预定价格">
			<el-input v-model="villa.reserve_price" style="width:80px;"></el-input>
		</el-form-item>

		<el-form-item label="滑动图片">
			<el-upload action="http://upload.qiniup.com" :file-list=villa.banners list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleBannerRemove" :data="postData" :on-success="handleBannerSuccess">
				<i class="el-icon-plus"></i>
			</el-upload>
			<el-dialog :visible.sync="dialogVisible" size="tiny">
				<img width="100%" :src="avatarImageUrl" alt="">
			</el-dialog>
		</el-form-item>

		<el-form-item label="详情图片">
			<el-upload action="http://upload.qiniup.com" :file-list="villa.descriptions_images" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleDescriptionImgRemove" :data="postData" :on-success="handleDescriptionImgSuccess">
				<i class="el-icon-plus"></i>
			</el-upload>
			<el-dialog :visible.sync="dialogVisible" size="tiny">
				<img width="100%" :src="avatarImageUrl" alt="">
			</el-dialog>
		</el-form-item>

		<el-form-item label="细节图片" style="margin-bottom:0px;">
			<el-upload action="http://upload.qiniup.com" :file-list="villa.details_icon" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleDetailImgRemove" :data="postData" :on-success="handleDetailImgSuccess">
				<i class="el-icon-plus"></i>
			</el-upload>
			<el-dialog :visible.sync="dialogVisible" size="tiny">
				<img width="100%" :src="avatarImageUrl" alt="">
			</el-dialog>
		</el-form-item>

		<el-form-item style="margin-top:0px;">
			<el-input v-for="(item,index) in villa.details_icon" v-model="villa.details_description[index]" style="width:150px;"></el-input>
		</el-form-item>

		<el-form-item label="服务设施">
			<el-upload action="http://upload.qiniup.com" :file-list="villa.services" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleServicesImgRemove" :data="postData" :on-success="handleServicesImgSuccess">
				<i class="el-icon-plus"></i>
			</el-upload>
			<el-dialog :visible.sync="dialogVisible" size="tiny">
				<img width="100%" :src="avatarImageUrl" alt="">
			</el-dialog>
		</el-form-item>

		<el-form-item label="定位">
			<el-input v-model="villa.location.longitude" style="width:150px;" placeholder="经度 longitude"></el-input>
			<el-input v-model="villa.location.latitude" style="width:150px;" placeholder="纬度 latitude"></el-input>
		</el-form-item>

		<el-form-item label="详细位置">
			<el-input v-model="villa.address" style="" placeholder="地址"></el-input>
		</el-form-item>

		<el-form-item label="相关房源">
			<el-input  v-model="relative_villa_1" style="width:140px" placeholder="相关房源"></el-input>
			<el-input  v-model="relative_villa_2" style="width:140px" placeholder="相关房源"></el-input>
		</el-form-item>
		

		<el-form-item label="设施">
			<el-input v-for="(item,index) in facility " v-model="facility[index]" style="width:150px;" placeholder=""></el-input>
			<i class="el-icon-plus" @click="addFacility"></i>
			<i class="el-icon-minus" @click="deleteFacility"></i>
		</el-form-item>


		<el-form-item label="位置信息">
			<el-input v-for="(item,index) in position " v-model="position[index]" style="width:150px;" placeholder=""></el-input>
			<i class="el-icon-plus" @click="addPosition"></i>
			<i class="el-icon-minus" @click="deletePosition"></i>
		</el-form-item>

		<el-form-item label="预定须知">
			<el-input v-for="(item,index) in tips " v-model="tips[index]" style="width:150px;" placeholder=""></el-input>
			<i class="el-icon-plus" @click="addTips"></i>
			<i class="el-icon-minus" @click="deleteTips"></i>
		</el-form-item>

		<el-form-item label="附近餐饮">
			<el-input v-for="(item,index) in nearby_dining " v-model="nearby_dining[index]" style="width:150px;" placeholder=""></el-input>
			<i class="el-icon-plus" @click="addNearbyDining"></i>
			<i class="el-icon-minus" @click="deleteNearbyDining"></i>
		</el-form-item>
		<el-form-item label="附近活动">
			<el-input v-for="(item,index) in nearby_activity " v-model="nearby_activity[index]" style="width:150px;" placeholder=""></el-input>
			<i class="el-icon-plus" @click="addNearbyActivity"></i>
			<i class="el-icon-minus" @click="deleteNearbyActivity"></i>
		</el-form-item>
		<el-form-item label="附近交通">
			<el-input v-for="(item,index) in nearby_traffic " v-model="nearby_traffic[index]" style="width:150px;" placeholder=""></el-input>
			<i class="el-icon-plus" @click="addNearbyTraffic"></i>
			<i class="el-icon-minus" @click="deleteNearbyTraffic"></i>
		</el-form-item>
		<el-form-item label="免费服务">
			<el-input v-for="(item,index) in free_services " v-model="free_services[index]" style="width:150px;" placeholder=""></el-input>
			<i class="el-icon-plus" @click="addFreeService"></i>
			<i class="el-icon-minus" @click="deleteFreeService"></i>
		</el-form-item>
		<el-form-item label="付费服务">
			<el-input v-for="(item,index) in cost_services " v-model="cost_services[index]" style="width:150px;" placeholder=""></el-input>
			<i class="el-icon-plus" @click="addCostService"></i>
			<i class="el-icon-minus" @click="deleteCostService"></i>
		</el-form-item>

		<el-form-item label="详情介绍">
			<el-input type="textarea" v-model="villa.overview"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button v-if="isCreate" @click="create" type="primary">立即创建</el-button>
			<el-button v-else @click="save" type="primary">保存</el-button>
			<el-button @click="cancel">取消</el-button>
		</el-form-item>

	</el-form>
</template>


<script>
import CityInfo from '../../common/js/city-data'
import base_image_url from '../../common/js/base_url'
import { getVillaInfoById } from '../../api/api';
import qs from 'qs'
export default {
	data() {
		return {
			form: {
				name: '',
				region: '',
				date1: '',
				date2: '',
				type: [],
				resource: '',
				desc: '',
				city: '',
				erae: '',
				minerae: '',
				selectedOptions: [],//地区筛选数组
			},
			villa: {
				id: '',
				name: '',
				avatar: '',
				city: '',
				region: '',
				//滑动图片
				banners: [],
				//详情图片
				descriptions_images: [],
				//服务设施
				services: [],
				normal_price_list: [],
				price_list: [],
				reserve_price: '',
				onDiscount: true,
				//折扣信息
				discount: '',
				//附近信息
				nearby: { activity: [], dining: [], traffic: [] },
				relative_villa_ids: [103, 105],
				//细节图片；浴室 卧室
				details_icon: [],
				//细节描述：7间浴室，7间卧室
				details_description: [],
				//服务描述
				service_detail: {},
				//简介
				overview: '',
				address: "",
				location: {
					//纬度
					latitude: '',
					//经度
					longitude: '',
				},

			},
			CityInfo: CityInfo,
			dialogVisible: false,
			postData: {
				token: '93L43E91oA1cbC9k40ZK2eSeOCqxxjJz1SsL4NGv:AKd2pGlo_zch4BJBLr5wsWZLV5Y=:eyJzY29wZSI6IjUxYmllc2h1IiwiZGVhZGxpbmUiOjE1NTM1MTIwMDJ9'
			},

			avatarImageUrl: '',
			relative_villa_1: '',
			relative_villa_2: '',
			allVillas: [{ name: "无", id: '0' }, { name: "嘉定馆", id: '103' }, { name: "安亭馆", id: '102' }, { name: "同济馆", id: '105' }],
			nearby_dining: [''],
			nearby_activity: [''],
			nearby_traffic: [''],
			cost_services: [''],
			free_services: [''],
			price_list: ['', '', '', '', '', '', ''],
			reserve_price_list: ['', '', '', '', '', '', ''],
			discount_price_list: ['', '', '', '', '', '', ''],
			
			tips: [''],
			position: [''],
			facility:[''],			

			_city: '',
			_region: '',

			isCreate: true
		}
	},


	mounted() {
		console.log(this.$route.params.id)
		var _id = this.$route.params.id
		var para = { "id": _id }
		console.log(para)

		

		if (_id) {
			this.$http.post("http://118.25.6.157:8686/homeparty/manage/getVillaInfoById", JSON.stringify(para), { headers: "Access-Control-Allow-Origin:*" }).then(function(response) {
				console.log(response)
				this.villa = response.body
				this.nearby_activity = this.villa.nearby.activity
				this.nearby_dining = this.villa.nearby.dining
				this.nearby_traffic = this.villa.nearby.traffic
				this.relative_villa_1 = this.villa.relative_villa_ids[0]
				this.relative_villa_2 = this.villa.relative_villa_ids[1]
				this.price_list = this.villa.normal_price_list
				this.discount_price_list = this.villa.price_list
				this.cost_services = this.villa.service_detail.cost
				this.free_services = this.villa.service_detail.free

				this._city = this.villa.city
				this._region = this.villa.region

				this.tips = this.villa.tips
				this.facility = this.villa.facility
				this.position = this.villa.position
				console.log(this.villa)
			}).catch(function(error) {
				console.log(error)
			})


			// getVillaInfoById({id: _id}).then(function(res) {
			// 	console.log(res);
			// }).catch(function(res) {
			// 	console.log(res)
			// })

			this.isCreate = false
		}
	},
	methods: {
		onSubmit() {
			console.log('submit!');
		},
		handleChange(value) {
			this.form.city = this.form.selectedOptions[0];
			this.form.erae = this.form.selectedOptions[1]
			this.form.minerae = this.form.selectedOptions[2]
			this.villa.city = this.form.selectedOptions[1]
			this.villa.region = this.form.selectedOptions[2]
		},
		handleAvatarRemove(file, fileList) {
			var index = this.villa.banners.indexOf(file)
			this.villa.avatar.splice(index, 1)
		},
		handlePictureCardPreview(file) {
			this.avatarImageUrl = file.url;
			this.dialogVisible = true;
		},
		handleAvatarSuccess(res, file) {
			console.log(file)
			this.villa.avatar = base_image_url + res.key

		},
		handleBannerSuccess(res) {
			var imgurl = base_image_url + res.key
			var dic = {}
			dic.url = imgurl
			this.villa.banners.push(dic)
		},
		handleBannerRemove(file, fileList) {
			var index = this.villa.banners.indexOf(file)
			this.villa.banners.splice(index, 1)
		},
		handleDetailImgSuccess(res) {
			var imgurl = base_image_url + res.key
			var dic = {}
			dic.url = imgurl
			this.villa.details_icon.push(dic)
			this.villa.details_description.push('')
		},
		handleDetailImgRemove(file, fileList) {
			var index = this.villa.details_icon.indexOf(file)
			this.villa.details_icon.splice(index, 1)
			this.villa.details_description.splice(index, 1)
		},
		handleDescriptionImgSuccess(res) {
			var imgurl = base_image_url + res.key
			var dic = {}
			dic.url = imgurl
			this.villa.descriptions_images.push(dic)
		},
		handleDescriptionImgRemove(file, fileList) {
			var index = this.villa.descriptions_images.indexOf(file)
			this.villa.descriptions_images.splice(index, 1)
		},
		handleServicesImgSuccess(res) {
			var imgurl = base_image_url + res.key
			var dic = {}
			dic.url = imgurl
			this.villa.services.push(dic)
		},
		handleServicesImgRemove(file, fileList) {
			var index = this.villa.services.indexOf(file)
			this.villa.services.splice(index, 1)
		},
		change1() {
			console.log(this.relative_villa_1)
		},
		change2() {
			console.log(this.relative_villa_2)
		},
		addNearbyDining() {
			this.nearby_dining.push('')
		},
		deleteNearbyDining() {
			this.nearby_dining.pop()
		},
		addNearbyActivity() {
			this.nearby_activity.push('')
		},
		deleteNearbyActivity() {
			this.nearby_activity.pop()
		},
		addNearbyTraffic() {
			this.nearby_traffic.push('')
		},
		deleteNearbyTraffic() {
			this.nearby_traffic.pop()
		},
		addFreeService() {
			this.free_services.push('')
		},
		deleteFreeService() {
			this.free_services.pop()
		},
		addCostService() {
			this.cost_services.push('')
		},
		deleteCostService() {
			this.cost_services.pop()
		},
		addPosition(){
			this.position.push('')
		},
		deletePosition(){
			this.position.pop()
		},
		addTips(){
			this.tips.push('')
		},
		deleteTips(){
			this.tips.pop()
		},
		addFacility(){
			this.facility.push('')
		},
		deleteFacility(){
			this.facility.pop()
		},
		switchClick(val){
			
		},
		create() {
			
			this.villa.nearby.activity = this.nearby_activity
			this.villa.nearby.dining = this.nearby_dining
			this.villa.nearby.traffic = this.nearby_traffic
			this.villa.normal_price_list = this.price_list
			this.villa.price_list = this.discount_price_list
			this.villa.relative_villa_ids[0] = this.relative_villa_1
			this.villa.relative_villa_ids [1] = this.relative_villa_2
			this.villa.city = this._city
			this.villa.region = this._region
			this.villa.service_detail.cost = this.cost_services
			this.villa.service_detail.free = this.free_services

			this.villa.tips = this.tips
			this.villa.facility = this.facility
			this.villa.position = this.position


			console.log(this.villa)
			this.$http.post("http://118.25.6.157:8686/homeparty/manage/createNewVilla", JSON.stringify(this.villa), { headers: "Content-Type:application/json" }).then(function(response) {
				console.log(response)
				if(response.body.result === 'success'){
					this.$router.push({ name: '主页', path: '/table' })
				}
			}).catch(function(error) {
				console.log(error)
			})
			// var para = this.villa
			// getVillaInfoById(para).then(function(res) {
			// 	console.log(res);
			// }).catch(function(res) {
			// 	console.log(res)
			// })
		},
		cancel() {
			this.$router.push({ name: '主页', path: '/table' })
		},
		
		translateData(){
			this.villa.nearby.activity = this.nearby_activity
			this.villa.nearby.dining = this.nearby_dining
			this.villa.nearby.traffic = this.nearby_traffic
			this.villa.normal_price_list = this.price_list
			this.villa.price_list = this.discount_price_list
			this.villa.relative_villa_ids[0] = this.relative_villa_1
			this.villa.relative_villa_ids[1] = this.relative_villa_2

			this.villa.tips = this.tips
			this.villa.facility = this.facility
			this.villa.position = this.position
		},
		
		save() {
			this.translateData()
			console.log(JSON.stringify(this.villa))

			this.$http.post("http://118.25.6.157:8686/homeparty/manage/setVillaInfo", JSON.stringify(this.villa), { headers: "Content-Type:application/json" }).then(function(response) {
				console.log(response)
				if(response.body.result === 'success'){
					this.$router.push({ name: '主页', path: '/table' })
				}
			}).catch(function(error) {
				console.log(error)
			})
		}

	},

	computed: {
		myAddressCity: function(value) {
			value = this.form.city
			for (var y in this.CityInfo) {
				if (this.CityInfo[y].value == value) {
					return value = this.CityInfo[y].label
				}
			}
		},
		myAddressErae: function(value) {
			value = this.form.erae
			console.log(value)
			for (var y in this.CityInfo) {
				for (var z in this.CityInfo[y].children) {
					if (this.CityInfo[y].children[z].value == value && value != undefined) {
						this.villa.city = this.CityInfo[y].children[z].label;
						this._city = this.CityInfo[y].children[z].label
						return value = this.CityInfo[y].children[z].label;
					}
				}
			}
		},
		myAddressMinerae: function(value) {
			value = this.form.minerae
			for (var y in this.CityInfo) {
				for (var z in this.CityInfo[y].children) {
					for (var i in this.CityInfo[y].children[z].children) {
						if (this.CityInfo[y].children[z].children[i].value == value && value != undefined) {
							this._region = this.CityInfo[y].children[z].children[i].label
							console.log(this._region)
							return value = this.CityInfo[y].children[z].children[i].label
						}
					}
				}
			}
		},
	}
}

</script>

<style>
.mg-right-40 {
	margin-right: 40px;
}
</style>
