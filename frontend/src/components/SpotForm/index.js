import { useEffect, useState } from "react";
import { createSpot } from "../../store/spots";
import { useDispatch } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { updateSpot } from "../../store/spots";

export default function CreateSpot() {
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  const [price, setPrice] = useState("");
  const [previewImg, setPreviewImg] = useState("");

  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");
  const [img5, setImg5] = useState("");
  const [errors, setErrors] = useState({});
  const [displayErrors, setDisplayErrors] = useState(false);

  const {formType} = useParams()
  const {spotId} = useParams()




  const history = useHistory();

  const dispatch = useDispatch();

  const validImage = (image) => {
    const fileTypes = ["png", "jpg", "jpeg"];

    for (let fileType of fileTypes) {
    }

    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // if (Object.values(errors).length) {
      //   setDisplayErrors(true);
      //   return;
      // }

      const spotData = {
      address,
      city,
      state,
      country,
      lat: 37,
      lng: 122,
      name: title,
      description,
      price,
    };

    if (formType === 'new') {

      dispatch(createSpot(spotData)).then((spot) =>
      history.push(`/spots/${spot.id}`)
      );
    } else {



      spotData.spotId = spotId
      updateSpot(spotData).then((data) => {
        history.push(`/spots/${spotId}`)
      })





    }


  };

  useEffect(() => {
    const errors = {};

    const images = [img2, img3, img4, img5, previewImg];

    for (let image of images) {
      if (!validImage(image)) {
        errors[image] = "Image URL must end in .png, .jpg, or .jpeg";
      }
    }

    if (!country.length) {
      errors.country = "Country is required";
    }

    if (!address.length) {
      errors.address = "Address is required";
    }

    if (!city.length) {
      errors.city = "City required";
    }

    if (!state.length) {
      errors.state = "State required";
    }

    if (description.length < 30) {
      errors.description = "Description needs a minimum of 30 characters";
    }

    if (!title.length) {
      errors.title = "Name is required";
    }

    if (!price.length) {
      errors.price = "Price is required";
    }

    if (!previewImg.length) {
      errors.previewImgRequired = "Preview image required";
    }

    setErrors(errors);
  }, [
    country,
    address,
    city,
    state,
    description,
    title,
    price,
    previewImg,
    img2,
    img3,
    img4,
    img5,
  ]);

  return (
    <div>
      <h1>Create a new Spot</h1>
      <h2>Where's upir place located?</h2>
      <p>
        Guests will only get your exact address once they booked a reservation
      </p>

      <form onSubmit={(e) => handleSubmit(e)}>
        {displayErrors && errors.country && <p>{errors.country}</p>}
        <label>
          Country
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          ></input>
        </label>
        <label>
          Street address
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></input>
        </label>
        <label>
          City
          <input value={city} onChange={(e) => setCity(e.target.value)}></input>
        </label>
        <label>
          State
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
          ></input>
        </label>
        <h2>Describe your place to guests</h2>
        <p>
          Mention the best features of your space, any special amentities like
          fast wif or parking, and what you love about the neighborhood.
        </p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <h2>Create a title for your spot</h2>
        <p>
          Catch guests' attention with a spot title that highlights what makes
          your place special.
        </p>
        <label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <h2>Set a base price for your spot</h2>
        <p>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </p>
        <label>
          $
          <input value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <h2>Liven up your spot with photos</h2>
        <p>Submit a link to at least one photo to publish your spot.</p>
        <input
          value={previewImg}
          onChange={(e) => setPreviewImg(e.target.value)}
        />
        {displayErrors && errors.previewImgRequired && (
          <div>{errors.previewImgRequired}</div>
        )}
        {displayErrors && errors.previewImg && <div>{errors.previewImg}</div>}
        <input value={img2} onChange={(e) => setImg2(e.target.value)} />
        <input value={img3} onChange={(e) => setImg3(e.target.value)} />
        <input value={img4} onChange={(e) => setImg4(e.target.value)} />
        <input value={img5} onChange={(e) => setImg5(e.target.value)} />
        <input />
        <button type="submit">{formType === 'new' ? 'Create Spot' : 'Update Spot'}</button>
      </form>
    </div>
  );
}
