export function validateInventoryBody(body, isComplete) {
  const validProperties = ["pointSell", "cantidadDisponible", "precioPorKg", "estado"];

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
  }

  return validateBodyCorrectness(body, validPropertiesInBody);
}

function validateBodyCorrectness(body, validPropertiesInBody) {
  const validProperties = ["pointSell", "cantidadDisponible", "precioPorKg", "estado"];

  // Check for invalid properties in body
  for (let property of Object.keys(body)) {
    if (!validProperties.includes(property)) {
      return {
        validation: false,
        message: `Body has a non-allowed property called ${property} for inventory`
      };
    }
  }

  let validationResult = null;

  for (let property of validPropertiesInBody) {
    switch (property) {
      case "pointSell":
        validationResult = validatePointSell(body.pointSell);
        if (!validationResult.validation) return validationResult;
        break;

      case "cantidadDisponible":
        validationResult = validateCantidadDisponible(body.cantidadDisponible);
        if (!validationResult.validation) return validationResult;
        break;

      case "precioPorKg":
        validationResult = validatePrecioPorKg(body.precioPorKg);
        if (!validationResult.validation) return validationResult;
        break;

      case "estado":
        validationResult = validateEstado(body.estado);
        if (!validationResult.validation) return validationResult;
        break;

      default:
        return {
          validation: false,
          message: `Body has a non-allowed property called ${property} for inventory`
        };
    }
  }

  return {
    validation: true,
    message: "All validation passed"
  };
}

function validatePointSell(pointSell) {
  if (typeof pointSell !== "string" || pointSell.trim().length === 0) {
    return {
      validation: false,
      message: "Point Sell ID must be a non-empty string"
    };
  }

  return {
    validation: true,
    message: "Point Sell is valid"
  };
}

function validateCantidadDisponible(cantidad) {
  const num = Number(cantidad);

  if (isNaN(num)) {
    return {
      validation: false,
      message: "Cantidad disponible must be a valid number"
    };
  }

  if (num < 0) {
    return {
      validation: false,
      message: "Cantidad disponible cannot be negative"
    };
  }

  return {
    validation: true,
    message: "Cantidad disponible is valid"
  };
}

function validatePrecioPorKg(precio) {
  const num = Number(precio);

  if (isNaN(num)) {
    return {
      validation: false,
      message: "Precio por kg must be a valid number"
    };
  }

  if (num <= 0) {
    return {
      validation: false,
      message: "Precio por kg must be greater than zero"
    };
  }

  return {
    validation: true,
    message: "Precio por kg is valid"
  };
}

function validateEstado(estado) {
  const validEstados = ["DISPONIBLE", "AGOTADO", "FUERA_SERVICIO"];

  if (!validEstados.includes(estado)) {
    return {
      validation: false,
      message: `Estado must be one of: ${validEstados.join(", ")}`
    };
  }

  return {
    validation: true,
    message: "Estado is valid"
  };
}
