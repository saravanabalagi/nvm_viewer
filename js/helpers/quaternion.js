class Quaternion {

  constructor(w, x, y, z) {
    this.w = w;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // Formulas taken from Wikipedia
  // https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles#Quaternion_to_Euler_Angles_Conversion
  toEuler = () => {

    // roll (x-axis rotation)
    let sinr_cosp = 2.0 * (this.w * this.x + this.y * this.z);
    let cosr_cosp = 1.0 - 2.0 * (this.x * this.x + this.y * this.y);
    let roll = Math.atan2(sinr_cosp, cosr_cosp);

    // pitch (y-axis rotation)
    let sinp = 2.0 * (this.w * this.y - this.z * this.x);
    let pitch = null;
    if (Math.abs(sinp) >= 1)
      // use 90 degrees if out of range
      pitch = this.copySign(Math.PI / 2, sinp);
    else pitch = Math.asin(sinp);

    // yaw (z-axis rotation)
    let siny_cosp = 2.0 * (this.w * this.z + this.x * this.y);
    let cosy_cosp = 1.0 - 2.0 * (this.y * this.y + this.z * this.z);
    let yaw = Math.atan2(siny_cosp, cosy_cosp);

    return {x: roll, y: pitch, z: yaw}
  };

  copySign = (a, b) => {
			return b < 0 ? -Math.abs(a) : Math.abs(a);
	}

}
