
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Book from "../../model/Book";
import bookService from "../../service/book.service";
import categoryService from "../../service/category.service";
import "./AddBook.css";
import { ToastContainer, toast } from "react-toastify";

const AddBook = () => {
  const [book, setBook] = useState({
    bookName:"",
    description:"",
    author:"",
    category:"",
    isbnNo:"",
    language:"",
    price:""

});


const [errors, setErrors] = useState({});
const [imgFile, setImgFile] = useState(null);


  const [categoryList, setCategoryList] = useState([]);
  
  const navigate = useNavigate();

  const handleBookImage = (e) => {
    const file = e.target.files[0];
    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
    if (file.size > maxSizeInBytes) {
      setErrors((prevState) => ({
        ...prevState,
        imgFile: `File size exceeds ${maxSizeInMB} MB.`,
      }));
      setImgFile(null); // Clear the file if it exceeds the size limit
    } else {
      setErrors((prevState) => ({
        ...prevState,
        imgFile: null,
      }));
      setImgFile(file);
    }
  };
  

  const handleBook = (e) => {
    const { name, value } = e.target;
    setBook((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
const validate = () => {
  const newErrors = {};
  if (!book.bookName) newErrors.bookName = "Book name is required";
  if (!book.description) newErrors.description = "Description is required";
  if (!book.author) newErrors.author = "Author is required";
  if (!book.category) newErrors.category = "Category is required";
  if (!book.isbnNo) newErrors.isbnNo = "ISBN No is required";
  if (!book.language) newErrors.language = "Language is required";
  if (!book.price) newErrors.price = "Price is required";
  if (!imgFile) newErrors.imgFile = "Image file is required";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
  

  const notify = () =>
    toast.success("Book Added Sucesfully", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    const notifyError = (message) =>
      toast.error(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });

  const registerBook = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const fd = new FormData();
    fd.append("bookName", book.bookName);
    fd.append("description", book.description);
    fd.append("author", book.author);
    fd.append("categorysId", book.categorysId);
    fd.append("isbnNo", book.isbnNo);
    fd.append("language", book.language);
    fd.append("price", book.price);
    fd.append("file", imgFile);

   // console.log(fd);
  // console.log(JSON.stringify(book.category));
  //console.log(book);
    bookService
      .saveBook(book)
      .then((res) => {
       // console.log(res.data.id);
          return bookService.uploadProductImage(imgFile,res.data.id)
      })
      .then(()=>{
        notify();
       setBook( new Book("", "", "", "", "", "", "", "", ""));
       navigate('/admin/ViewBook')
      })
      .catch((error) => {
        console.log(error);
        notifyError("failed to add,please try again..!");
        
      });
  };

  useEffect(() => {
    categoryService
      .getAllCategory()
      .then((response) => {
        setCategoryList(response.data);
        // console.log(response.data);
      })
      .catch();
  }, []);

  return (
    <div class="card paint-card cardx">
      <div class="card-body">
        <h4 class="form-signin-heading text-center">Add Book</h4>
        <form
          noValidate
          class="form-signin"
          method="post"
          onSubmit={(e) => registerBook(e)}
        >
          <div className="row">
            <div class="mb-3 col">
              <label for="exampleInputEmail1" class="form-label">  
                Book Name
              </label>
              <input
                type="text"
                class="form-control"
                required
                name="bookName"
                value={book.bookName}
                onChange={(e) => handleBook(e)}
                placeholder="Enter Book Name"
              
              />
              {errors.bookName && <p className="text-danger">{errors.bookName}</p>}
            </div>

            <div class="mb-3 col">
              <label for="exampleInputEmail1" class="form-label" aria-placeholder="Enter author">
                Author
              </label>
              <input
                type="text"
                class="form-control"
                required
                name="author"
                value={book.author}
                onChange={(e) => handleBook(e)}
                 placeholder="Enter Author Name"
              />
               {errors.author && <p className="text-danger">{errors.author}</p>}
            </div>
          </div>

          <div className="row">
            <div class="mb-3 col">
              <label for="exampleInputEmail1" class="form-label" aria-placeholder="Enter category">
                Category
              </label>
              <select
                name="category"
                class="form-control"
                onChange={(e) => handleBook(e)}

              >
                <option>--select--</option>
                {categoryList.map((category, num) => (
                  <option value={category.categoryName}>{category.categoryName}</option>
                ))}
              </select>
              {errors.category && <p className="text-danger">{errors.category}</p>}
            </div>

            <div class="mb-3 col">
              <label for="exampleInputEmail1" class="form-label" aria-placeholder="Enter ISBN number"> 
                ISBN No
              </label>
              <input
                type="text"
                class="form-control"
                required
                name="isbnNo"
                value={book.isbnNo}
                onChange={(e) => handleBook(e)}
                 placeholder=" Enter identification number"
              />
              {errors.isbnNo && <p className="text-danger">{errors.isbnNo}</p>}
            </div>
          </div>
          <div className="row">
            <div class="mb-3 col">
              <label for="exampleInputEmail1" class="form-label" >
                Price
              </label>
              <input
                type="number"
                class="form-control"
                required
                name="price"
                value={book.price}
                onChange={(e) => handleBook(e)}
                 placeholder="Enter Price"
              />
               {errors.price && <p className="text-danger">{errors.price}</p>}
            </div>
     </div>
            <div className="mb-3 col">
          <label htmlFor="imageUpload" className="form-label">
          Image (Max 2 MB)
        </label>
  <input
    type="file"
    className="form-control"
    required
    name="img"
    onChange={handleBookImage}
    accept="image/jpeg, image/png, image/jpg"
    placeholder="Upload image in JPEG, JPG, or PNG format"
  />
  {errors.imgFile && <p className="text-danger">{errors.imgFile}</p>}
</div>
      
      
          <div class="mb-3 col">
            <label for="exampleInputEmail1" class="form-label">
              Language
            </label>
            <input
              type="text"
              class="form-control"
              required
              name="language"
              value={book.language}
              onChange={(e) => handleBook(e)}
              placeholder="Enter Language"
            />
             {errors.language && <p className="text-danger">{errors.language}</p>}
          </div>

          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">
              Description
            </label>
            <textarea
              rows="3"
              cols=""
              class="form-control"
              name="description"
              value={book.description}
              onChange={(e) => handleBook(e)}
              placeholder="Enter description 100 words"
            ></textarea>
            {errors.description && <p className="text-danger">{errors.description}</p>}
          </div>
          <button class="btn bg-primary text-white col-md-12" type="submit">
            Submit
          </button>

          <div class="text-center p-3"></div>
        </form>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export { AddBook };
