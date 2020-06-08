<!DOCTYPE html>
<html lang="en">
<head>
		<script src="https://kit.fontawesome.com/d8d7e099f2.js" crossorigin="anonymous"></script>

		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
        <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
		<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
		<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
        <link href="stylesheet1.css" rel="stylesheet" />
</head>
<body>
  <div class="container">
    <div class="row">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card card-signin my-5">
          <div class="card-body">
            <h5 class="card-title text-center"><b>ВЛЕЗ В ПРОФИЛА СИ</b></h5>
            <form class="form-signin">
              <div class="form-label-group">
                <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
                <label for="inputEmail">Email</label>
              </div>
              <div class="form-label-group">
                <input type="password" id="inputPassword" class="form-control" placeholder="Password" required>
                <label for="inputPassword">Парола</label>
              </div>
              <button class="btn btn-success btn-primary btn-block text-uppercase" type="submit">ВЛЕЗ</button>
			  <button class="btn btn-block btn-outline-danger" type="submit"><i class="fab fa-google" style = "font-size: 15pt;"></i>  ВЛЕЗ С GOOGLE</button>
              <hr class="my-4">
			  <div class="a-divider a-divider-break" style = "font-size: 10pt; text-align: center;"><a href = "registform.php"><h5>РЕГИСТРИРАЙ СЕ</h5></a></div>
              
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>