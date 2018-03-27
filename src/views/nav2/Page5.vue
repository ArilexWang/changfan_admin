<template>
	<section>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<div>{{model}}</div>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="故障大类"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>

			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="objects" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="_name" label="名称" width="120" sortable>
			</el-table-column>

			<el-table-column label="操作" width="300">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="small" @click="handleComment(scope.$index,scope.row)">查看回收信息</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="名称" prop="_name">
					<el-input v-model="editForm._name" auto-complete="off"></el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="名字" prop="modelID">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--回收信息界面-->
		<el-dialog title="回收信息" v-model="messageFormVisible" :close-on-click-modal="false">
			<el-form :modle="messageForm" label-width="80px" ref="messageForm">
				<el-form-item label="">
					<div v-for="(item,index) in messageForm.choice ">
						<el-input  v-model="item.name" style="width:150px;" placeholder="名称"></el-input>
						<el-input  v-model="item.value" style="width:150px;" placeholder="价值"></el-input>
						
					</div>
					<i class="el-icon-plus" @click="addMessage"></i>
					<i class="el-icon-minus" @click="deleteMessage"></i>
					
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="messageFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="messageSubmit"  :loading="messageLoading">提交</el-button>
			</div>

		</el-dialog>

	</section>
</template>

<script>
import util from '../../common/js/util'
//import NProgress from 'nprogress'
import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, getAllMalfunctionCategory, getAllMalfunctionDetail } from '../../api/api';
import CityInfo from '../../common/js/city-data'
import base_image_url from '../../common/js/base_url'
import host from '../../common/js/host'
export default {
	data() {
		return {
			filters: {
				name: ''
			},
			components: {

			},
			users: [],
			total: 6,
			page: 1,
			listLoading: false,
			sels: [],//列表选中列
			brandID: 0,
			brandName: "",
			editFormVisible: false,//编辑界面是否显示
			editLoading: false,
			editFormRules: {
				name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				]
			},
			//编辑界面数据
			editForm: {
				id: 0,
				name: '',
			},
			objects: [],
			addFormVisible: false,//新增界面是否显示
			addLoading: false,
			addFormRules: {

			},
			//新增界面数据
			addForm: {
				name: '',

			},
			messageFormVisible: false, //信息界面是否显示
			messageLoading: false,
			messageForm: {
				choice: [],
			},
			main_banners: [],
			postData: {
				token: '93L43E91oA1cbC9k40ZK2eSeOCqxxjJz1SsL4NGv:QF7ZWpzyVCD1_vuo3GJhCovSoAI=:eyJzY29wZSI6IjUxYmllc2h1IiwiZGVhZGxpbmUiOjE5NTE1NTkxNDR9'
			},
			previewImageUrl: '',
			dialogVisible: false,
			villas: []

		}
	},
	methods: {
		//预览图片
		handlePictureCardPreview(file) {
			this.previewImageUrl = file.url;
			this.dialogVisible = true;
		},
		handleAvatarSuccess(res, file) {
			console.log(file)
			this.editForm.thumbnail = base_image_url + res.key
			console.log(this.editForm)
		},
		createAvatarSuccess(res, file) {
			console.log(file)
			this.addForm.thumbnail = base_image_url + res.key
			console.log(this.editForm)
		},
		//上传成功
		handleBannerSuccess(res) {
			var imgurl = base_image_url + res.key
			var dic = {}
			dic.url = imgurl
			this.main_banners.push(dic)
		},
		handleBannerRemove(file, fileList) {
			var index = this.main_banners.indexOf(file)
			this.main_banners.splice(index, 1)
		},
		addMessage(){
			this.messageForm.choice.push({name:"",value:""})
		},
		deleteMessage(){
			this.messageForm.choice.pop()
		},
		messageSubmit(){
			console.log(this.messageForm)
			this.messageForm.choice.forEach(item=>{
				item.value = parseInt(item.value)
			})
			var para = { categoryID:this.messageForm.categoryID ,fields: this.messageForm.choice}
			var that = this
			this.$http.post(host + "createEvaluationChoice/", JSON.stringify(para), { headers: "Content-Type:application/json" }).then(function(response) {
				console.log(response)
				that.messageFormVisible = false
			}).catch(function(error) {
				console.log(error)
			})
		},
		//删除
		handleDel: function(index, row) {
			this.listLoading = true;
			let para = { detailID: this.objects[index].detailID };
			this.$http.post(host + "deleteMalfunctionDetailByID/", JSON.stringify(para), { headers: "Content-Type:application/json" }).then(function(response) {
				this.listLoading = false;
				console.log(response)
				this.getMalfunctionDetail()
			}).catch(function(error) {
				console.log(error)
			})
		},
		//显示编辑界面
		handleEdit: function(index, row) {
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row);
		},
		//显示新增界面
		handleAdd: function() {
			this.addFormVisible = true;
			this.addForm = {

			}
		},
		handleComment: function(index, row) {
			console.log(this.objects[index])
			var that = this
			var para = { categoryID: this.objects[index].id }
			this.$http.post(host + "getEvaluationChoiceByCategoryID/", JSON.stringify(para), { headers: "Content-Type:application/json" }).then(function(response) {
				console.log(response)
				that.messageFormVisible = true
				that.messageForm.categoryID = that.objects[index].id
				if ((response.body.length == 0) && (that.messageForm.choice.length == 0)) {
					that.messageForm.choice.push({ name: "", value: ""})
					console.log(that.messageForm)
				} else if (that.messageForm.choice.length == 0){
					response.body.forEach(item=>{
						var temp = {}
						temp.name = item.fields._name
						temp.value = item.fields._decreasedValue
						console.log(temp)
						that.messageForm.choice.push(temp)
					})
				}
			}).catch(function(error) {
				console.log(error)
			})
		},

		handleCurrentChange: function(val) {
			console.log(val)
			this.page = val
			this.getMalfunctionDetail()
		},
		//编辑
		editSubmit: function() {
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true;
						//NProgress.start();
						let para = Object.assign({}, this.editForm);
						let para2 = {
							name: para._name,
							categoryID: para.id,
						}
						var params = JSON.stringify(para2)
						console.log(params)
						this.$http.post(host + "setEvaluationCategory/", params, { headers: "Content-Type:application/json" }).then(function(response) {
							this.editLoading = false;
							this.editFormVisible = false;
							this.getMalfunctionDetail()
						}).catch(function(error) {
							console.log(error)
						})

					});
				}
			});
		},
		//新增
		addSubmit: function() {
			this.$refs.addForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.addLoading = true;
						var para = Object.assign({}, this.addForm);
						console.log(para)
						para.model = this.model
						var params = JSON.stringify(para)
						console.log(params)
						this.$http.post(host + "createEvaluationCategory/", params, { headers: "Content-Type:application/json" }).then(function(response) {
							this.addLoading = false;
							console.log(response)
							this.addFormVisible = false;
							this.getMalfunctionDetail()
						}).catch(function(error) {
							console.log(error)
						})
					});
				}
			});
		},
		selsChange: function(sels) {
			this.sels = sels;
		},
		//批量删除
		batchRemove: function() {
			var ids = this.sels.map(item => item.id).toString();
			this.$confirm('确认删除选中记录吗？', '提示', {
				type: 'warning'
			}).then(() => {
				this.listLoading = true;
				//NProgress.start();
				let para = { ids: ids };
				batchRemoveUser(para).then((res) => {
					this.listLoading = false;
					//NProgress.done();
					this.$message({
						message: '删除成功',
						type: 'success'
					});
					this.getUsers();
				});
			}).catch(() => {

			});
		},
		getMalfunctionDetail: function() {
			this.objects = []
			var para = { model: this.model }
			var parms = JSON.stringify(para)
			var that = this
			this.$http.post(host + "getEvaluationCategoryByModel/", parms, { headers: "Content-Type:application/json" }).then(function(response) {
				console.log(response)
				var _objects = []
				response.body.forEach(item => {
					var temp = item.fields
					temp.id = item.pk
					_objects.push(temp)
				})
				that.objects = _objects
			}).catch(function(error) {
				console.log(error)
			})
		},
		getMalfunctionDetailByBrand: function(page) {
			var _objects = []
			console.log(page)
			console.log(this.objects)
			if (page === 1) {
				this.objects.forEach(function(element) {
					if (element.brandName === " 苹果") {
						console.log(element)
						_objects.push(element)
					}
				}, this);
			} else if (page === 2) {
				this.objects.forEach(function(element) {
					if (element.brandName === " 华为") {
						_objects.push(element)
					}
				}, this);
			}
			else if (page == 3) {
				this.objects.forEach(function(element) {
					if (element.brandName === " 小米") {
						_objects.push(element)
					}
				}, this);
			}
			else if (page == 4) {
				this.objects.forEach(function(element) {
					if (element.brandName === " vivo") {
						_objects.push(element)
					}
				}, this);
			}
			else if (page == 5) {
				this.objects.forEach(function(element) {
					if (element.brandName === " 三星") {
						_objects.push(element)
					}
				}, this);
			}
			else if (page == 6) {
				this.objects.forEach(function(element) {
					if (element.brandName === "oppo ") {
						_objects.push(element)
					}
				}, this);
			}
			console.log(_objects)
			this.objects = _objects
		},
	},

	mounted() {
		console.log(this.$route.params)
		this.model = this.$route.params.id
		this.getMalfunctionDetail()

	},

}

</script>

<style scoped>

</style>