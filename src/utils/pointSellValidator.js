import mongoose from "mongoose";

export function validatePointSellBody(body, isComplete) {
  const validProperties = ["name", "type", "direction", "latitude", "longitude", "state", "owner"];

  if (!body) {
    return {
      validation: false,
      message: "Body is empty and is required"
    };
  }

  const validPropertiesInBody = validProperties.filter((property) =>
    body.hasOwnProperty(property)
  );

  if (isComplete) {
    if (validPropertiesInBody.length === 0) {
      return {
        validation: false,
        message: "Body has none valid property"
      };
    }
  } else {
    if (validPropertiesInBody.length === 0) {
      return {
        validation: false,
        message: "Body has none valid property"
      };
    }
  }

  return validateBodyCorrectness(body, validPropertiesInBody);
}

function validateBodyCorrectness(body, validPropertiesInBody) {
  const validProperties = ["name", "type", "direction", "latitude", "longitude", "state", "owner"];

  // Check for invalid properties in body
  for (let property of Object.keys(body)) {
    if (!validProperties.includes(property)) {
      return {
        validation: false,
        message: `Body has a non-allowed property called ${property} for point sell`
      };
    }
  }

  let validationResult = null;

  for (let property of validPropertiesInBody) {
    console.log(`Checking property called ${property}`);
    switch (property) {
      case "name":
        validationResult = validateName(body.name);
        if (!validationResult.validation) return validationResult;
        break;

      case "type":
        validationResult = validateType(body.type);
        if (!validationResult.validation) return validationResult;
        break;

      case "direction":
        validationResult = validateDirection(body.direction);
        if (!validationResult.validation) return validationResult;
        break;

      case "latitude":
        validationResult = validateLatitude(body.latitude);
        if (!validationResult.validation) return validationResult;
        break;

      case "longitude":
        validationResult = validateLongitude(body.longitude);
        if (!validationResult.validation) return validationResult;
        break;

      case "state":
        validationResult = validateState(body.state);
        if (!validationResult.validation) return validationResult;
        break;

      case "owner":
        validationResult = validateOwner(body.owner);
        if (!validationResult.validation) return validationResult;
        break;

      default:
        return {
          validation: false,
          message: `Body has a non-allowed property called ${property} for point sell`
        };
    }
  }

  return {
    validation: true,
    message: "All validation passed"
  };
}

function validateName(name) {
  if (typeof name !== "string" || name.trim().length === 0) {
    return {
      validation: false,
      message: "Name must be a non-empty string"
    };
  }

  if (name.length < 3 || name.length > 100) {
    return {
      validation: false,
      message: "Name must be between 3 and 100 characters"
    };
  }

  return {
    validation: true,
    message: "Name is valid"
  };
}

function validateType(type) {
  const validTypes = ["FIJO", "MOVIL"];

  if (!validTypes.includes(type)) {
    return {
      validation: false,
      message: `Type must be one of: ${validTypes.join(", ")}`
    };
  }

  return {
    validation: true,
    message: "Type is valid"
  };
}

function validateDirection(direction) {
  if (typeof direction !== "string" || direction.trim().length === 0) {
    return {
      validation: false,
      message: "Direction must be a non-empty string"
    };
  }

  if (direction.length < 5 || direction.length > 200) {
    return {
      validation: false,
      message: "Direction must be between 5 and 200 characters"
    };
  }

  return {
    validation: true,
    message: "Direction is valid"
  };
}

function validateLatitude(latitude) {
  const lat = Number(latitude);

  if (isNaN(lat)) {
    return {
      validation: false,
      message: "Latitude must be a valid number"
    };
  }

  if (lat < -90 || lat > 90) {
    return {
      validation: false,
      message: "Latitude must be between -90 and 90"
    };
  }

  return {
    validation: true,
    message: "Latitude is valid"
  };
}

function validateLongitude(longitude) {
  const lon = Number(longitude);

  if (isNaN(lon)) {
    return {
      validation: false,
      message: "Longitude must be a valid number"
    };
  }

  if (lon < -180 || lon > 180) {
    return {
      validation: false,
      message: "Longitude must be between -180 and 180"
    };
  }

  return {
    validation: true,
    message: "Longitude is valid"
  };
}

function validateState(state) {
  const validStates = ["ACTIVO", "INACTIVO", "PENDIENTE"];

  if (!validStates.includes(state)) {
    return {
      validation: false,
      message: `State must be one of: ${validStates.join(", ")}`
    };
  }

  return {
    validation: true,
    message: "State is valid"
  };
}

function validateOwner(owner) {
  if (typeof owner !== "string" || owner.trim().length === 0) {
    return {
      validation: false,
      message: "Owner must be a non-empty string"
    };
  }

  if (!mongoose.Types.ObjectId.isValid(owner)) {
    return {
      validation: false,
      message: "Owner must be a valid MongoDB ObjectId (24 hex characters)"
    };
  }

  return {
    validation: true,
    message: "Owner is valid"
  };
}
