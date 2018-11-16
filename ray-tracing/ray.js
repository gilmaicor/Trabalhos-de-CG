class RaycastResult {

    constructor(hit, t, collideWith){
            /** To indicate if there was an actual hit */
      this.hit = hit;

      /** The parametric position of the hit. Gives result in x,y,z when combined
       *  with the original ray */
      this.t = t;

      /** The object that the ray collided with */
      this.collideWith = collideWith;
    }

    RaycastResult() {
        this.hit = false;
        this.collideWith = 0;
        this.t = Number.POSITIVE_INFINITY
    }
};


class Ray
{
    constructor(origin, direction, bounceCount, originatingObject) {
      /** The origination point of the ray */
    this.origin = origin;

    /** The direction of the ray. Remember to normalize this!! */
    this.direction = direction;

    /** Number of times the ray has been already reflected */
    this.bounceCount = bounceCount;

    /** The object from which the ray originated */
    this.originatingObject = originatingObject;
    }

    Ray () {
        this.originatingObject = 0;
        this.bounceCount = 0;
    }

    /** Get the position for a given t along this ray */
    getPosition (t) {
        return this.origin + t * this.direction;
    }

    static getReflectedRay (previous, point, normal) {
        var newRay = new Ray();

        newRay.origin = point;
        var direction = previous.direction + (-2 * vec3.dot(previous.direction, normal)) * normal;
        newRay.direction = vec3.normalize(direction, direction);
        newRay.bounceCount = previous.bounceCount + 1;

        /* shift the origin a bit "up" above the surface along the normal
         * in order to avoid floating point related artifacts */
        newRay.origin = newRay.origin + 0.01 * normal;

        return newRay;
    }
  }