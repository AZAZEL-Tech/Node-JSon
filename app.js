const express=require('express');
const mongoose=require('mongoose');
const session=require('express-session');
const flash=require('connect-flash');
const path=require('path');
const app=express();

mongoose.connect('mongodb://127.0.0.1:27017/dapodik');

const userSchema=new mongoose.Schema({username:String,password:String});
const User=mongoose.model('user',userSchema);

const siswaSchema=new mongoose.Schema({
  nama:String,jk:String,nisn:{type:String,unique:true},
  nik:{type:String,unique:true},nokk:String,tingkat:String,
  rombel:String,terdaftar:String,tl:String,tgl_masuk:Date
});
const Siswa=mongoose.model('siswa',siswaSchema);

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(session({secret:'secret',resave:false,saveUninitialized:true}));
app.use(flash());

function auth(req,res,next){ if(!req.session.login) return res.redirect('/'); next(); }

app.get('/',(req,res)=>res.render('login',{msg:req.flash('msg')}));

app.post('/login',async(req,res)=>{
  const admin=await User.findOne({username:req.body.username,password:req.body.password});
  if(!admin){ req.flash('msg','Login gagal'); return res.redirect('/'); }
  req.session.login=true; res.redirect('/home');
});

app.get('/home',auth,(req,res)=>res.render('home'));

app.get('/siswa',auth,async(req,res)=>{
  const data=await Siswa.find(); res.render('siswa',{data,msg:req.flash('msg')});
});

app.listen(3000);
