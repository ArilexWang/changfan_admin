<template>
	<section>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<div></div>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="故障大类"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="searchVillaByKey">查询</el-button>
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
			<el-table-column prop="icon" label="图标" width="120" sortable>
				<template scope="scope">
					<img :src="scope.row.icon" alt="" width="30px">
				</template>
			</el-table-column>
            <el-table-column prop="thumbnail" label="详情图片" width="120" sortable>
				<template scope="scope">
					<img :src="scope.row.thumbnail" alt="" width="30px">
				</template>
			</el-table-column>
			<el-table-column prop="name" label="故障名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="categoryID" label="ID" width="120" sortable>
			</el-table-column>
            <el-table-column prop="description" label="故障描述" width="120" sortable>
			</el-table-column>
			<el-table-column label="操作" width="300">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="small" @click="handleComment(scope.$index,scope.row)">查看故障信息</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="型号名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
                <el-form-item label="图标" prop="name">
					<el-upload action="http://upload.qiniup.com" :show-file-list="false" list-type="picture-card" :on-preview="handlePictureCardPreview" :data="postData" :on-success="handleIconSuccess">
						<img v-if="editForm.icon" :src="editForm.icon" class="avatar" style="width:148px;height:148px">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="故障详情" prop="name">
					<el-upload action="http://upload.qiniup.com" :show-file-list="false" list-type="picture-card" :on-preview="handlePictureCardPreview" :data="postData" :on-success="handleAvatarSuccess">
						<img v-if="editForm.thumbnail" :src="editForm.thumbnail" class="avatar" style="width:148px;height:148px">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
    
				<el-form-item label="故障描述" prop="name">
					<el-input v-model="editForm.description" auto-complete="off"></el-input>
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
				<el-form-item label="型号名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="logo" prop="name">
					<el-upload action="http://upload.qiniup.com" :show-file-list="false" list-type="picture-card" :on-preview="handlePictureCardPreview" :data="postData" :on-success="createAvatarSuccess">
						<img v-if="addForm.thumbnail" :src="addForm.thumbnail" class="avatar" style="width:148px;height:148px">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="类型" prop="name">
					<el-input v-model="addForm.deviceType" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--工具条-->
		<el-col :span="24" class="toolbar">

			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

	</section>
</template>

<script>
import util from '../../common/js/util'
//import NProgress from 'nprogress'
import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, getAllMalfunctionCategory } from '../../api/api';
import CityInfo from '../../common/js/city-data'
import base_image_url from '../../common/js/base_url'
import Form from './Form'
import host from '../../common/js/host'
export default {
	data() {
		return {
			filters: {
				name: ''
			},
			components: {
				Form
			},
			users: [],
			total: 0,
			page: 1,
			listLoading: false,
			sels: [],//列表选中列
			brandID:0,
			brandName:"",
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
				thumbnail: "",
			},
			objects:[],
			addFormVisible: false,//新增界面是否显示
			addLoading: false,
			addFormRules: {
				name: [
					{ required: true, message: '请输入姓名', trigger: 'blur' }
				]
			},
			//新增界面数据
			addForm: {
				id: 0,
				name: '',
				thumbnail: "",

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
		//性别显示转换
		formatSex: function(row, column) {
			return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
		},
		handleCurrentChange(val) {
			this.page = val;
			this.getUsers();
		},
		//获取用户列表
		getUsers() {
			let para = {
				page: this.page,
				name: this.filters.name
			};
			this.listLoading = true;
			//NProgress.start();
			getUserListPage(para).then((res) => {
				this.total = res.data.total;
				this.users = res.data.users;
				this.listLoading = false;
				//NProgress.done();
			});
		},

		searchVillaByKey() {
			let para = {
				name: this.filters.name
			};
			console.log(para)
			// this.listLoading = true
			getVillaByKey(para).then(function(res) {
				console.log(res);
			}).catch(function(res) {
				console.log(res)
			})

		},
		//预览图片
		handlePictureCardPreview(file) {
			this.previewImageUrl = file.url;
			this.dialogVisible = true;
		},
		handleIconSuccess(res, file) {
			console.log(file)
			this.editForm.icon = base_image_url + res.key
			console.log(this.editForm)
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

		//删除
		handleDel: function(index, row) {
			this.listLoading = true;
			let para = { modelID: this.villas[index].modelID };
			this.$http.post(host + "deleteElectronicsModelByID/", JSON.stringify(para), { headers: "Content-Type:application/json" }).then(function(response) {
				this.listLoading = false;
				console.log(response)
				this.getModel(this.brandID)
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
				name: '',
				thumbnail: "",
			}
		},
		handleComment: function(index, row) {
			var _id = this.villas[index].brandID
			this.$router.push({ name: '型号', path: '/form', params: { id: _id } })
		},
		

		//编辑
		editSubmit: function() {
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true;
						//NProgress.start();
						let para = Object.assign({}, this.editForm);
						var params = JSON.stringify(para)
						console.log(params)
						this.$http.post(host + "setMalfunctionCategory/", params, { headers: "Content-Type:application/json" }).then(function(response) {
							this.editLoading = false;
							this.editFormVisible = false;
							this.getMalfunction()
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
						para.brandID = this.brandID
						para.color = "a"
						var params = JSON.stringify(para)
						console.log(params)
						this.$http.post("http://118.25.20.50:8000/scavenger/createElectronicsModel/", params, { headers: "Content-Type:application/json" }).then(function(response) {
							this.addLoading = false;
							console.log(response)
							this.addFormVisible = false;
							this.getModel(this.brandID)

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
		getMalfunction:function(){
            this.objects = []
            getAllMalfunctionCategory().then((res) => {
                console.log(res.data)
                for(var i in res.data){
                    var temp = res.data[i]
                    var tempcata = {}
                    tempcata.categoryID = temp.pk
                    tempcata.name = temp.fields._name
                    tempcata.icon = temp.fields._icon
                    tempcata.thumbnail = temp.fields._thumbnail
                    tempcata.description = temp.fields._description
                    this.objects.push(tempcata)
                }
            })
        }
	},

	mounted() {
		this.getMalfunction()
	},

}

</script>

<style scoped>

</style>