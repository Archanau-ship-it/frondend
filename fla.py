from flask import Flask,render_template
app=Flask(__name__)
app.config['upload path']='static/images'
@app.route('/<name>')
def home(name):
    return render_template('index.html',name)
@app.route('/about')
def about():
    return"this is about page"
@app.route('/register',methods=['POST'])
def register():
    name=request.args.get['name']
    email=request.args.get['email']
    return render_template('fla.reg.html',name=name,email=email)
@app.route('/submit')
def submit():
    file=request.files['file']
    file.save(os.path.join(app.config(['UPLOAD.PATH'],file.filename))
@app.route('/product')
def product():
    return "This is product page"