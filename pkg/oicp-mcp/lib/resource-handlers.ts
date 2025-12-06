/**
 * MCP Resource Handlers
 * Handles MCP resource requests for OICP documentation
 */

import {readFile, readdir} from 'fs/promises';
import {join} from 'path';
import type {OICPParser} from './oicp-parser';
import type {OICPRole, ResourceURI} from './types';

/**
 * Parse a resource URI into structured components
 * Format: oicp://<role>/<type>[/<imageName>]
 * Examples:
 *   - oicp://cpo/openapi
 *   - oicp://emp/documentation
 *   - oicp://cpo/images/hubject_1.png
 */
export function parseResourceURI(uri: string): ResourceURI | null {
  const match = uri.match(/^oicp:\/\/(cpo|emp)\/(openapi|documentation|images)(?:\/(.+))?$/);

  if (!match) {
    return null;
  }

  const [, role, type, imageName] = match;

  return {
    role: role as OICPRole,
    type: type as 'openapi' | 'documentation' | 'images',
    imageName,
  };
}

/**
 * Resource handler class for OICP documentation
 */
export class ResourceHandler {
  private readonly basePath: string;
  private readonly parser: OICPParser;

  constructor(basePath: string, parser: OICPParser) {
    this.basePath = basePath;
    this.parser = parser;
  }

  /**
   * List all available resources
   */
  async listResources(): Promise<Array<{uri: string; name: string; description: string; mimeType: string}>> {
    const resources: Array<{uri: string; name: string; description: string; mimeType: string}> = [];

    // Add OpenAPI spec resources
    resources.push({
      uri: 'oicp://cpo/openapi',
      name: 'CPO OpenAPI Specification',
      description: 'OICP v2.3 OpenAPI specification for Charge Point Operators',
      mimeType: 'application/x-yaml',
    });

    resources.push({
      uri: 'oicp://emp/openapi',
      name: 'EMP OpenAPI Specification',
      description: 'OICP v2.3 OpenAPI specification for e-Mobility Providers',
      mimeType: 'application/x-yaml',
    });

    // Add documentation resources
    resources.push({
      uri: 'oicp://cpo/documentation',
      name: 'CPO HTML Documentation',
      description: 'Complete HTML documentation for CPO OICP integration',
      mimeType: 'text/html',
    });

    resources.push({
      uri: 'oicp://emp/documentation',
      name: 'EMP HTML Documentation',
      description: 'Complete HTML documentation for EMP OICP integration',
      mimeType: 'text/html',
    });

    // Add image resources for CPO
    const cpoImages = await this.listImages('cpo');
    for (const image of cpoImages) {
      resources.push({
        uri: `oicp://cpo/images/${image}`,
        name: `CPO Diagram: ${image}`,
        description: `CPO documentation diagram image: ${image}`,
        mimeType: this.getImageMimeType(image),
      });
    }

    // Add image resources for EMP
    const empImages = await this.listImages('emp');
    for (const image of empImages) {
      resources.push({
        uri: `oicp://emp/images/${image}`,
        name: `EMP Diagram: ${image}`,
        description: `EMP documentation diagram image: ${image}`,
        mimeType: this.getImageMimeType(image),
      });
    }

    return resources;
  }

  /**
   * Get a resource by URI
   */
  async getResource(uri: string): Promise<{contents: string; mimeType: string}> {
    const parsed = parseResourceURI(uri);

    if (!parsed) {
      throw new Error(`Invalid resource URI: ${uri}`);
    }

    const {role, type, imageName} = parsed;

    switch (type) {
      case 'openapi':
        return this.getOpenAPISpec(role);
      case 'documentation':
        return this.getDocumentation(role);
      case 'images':
        if (!imageName) {
          throw new Error('Image name required for images resource');
        }
        return this.getImage(role, imageName);
      default:
        throw new Error(`Unknown resource type: ${type}`);
    }
  }

  /**
   * Get OpenAPI specification as YAML string
   */
  private async getOpenAPISpec(role: OICPRole): Promise<{contents: string; mimeType: string}> {
    const filePath = join(this.basePath, 'oicp', 'v2.3', role, 'openapi.yaml');
    const contents = await readFile(filePath, 'utf-8');

    return {
      contents,
      mimeType: 'application/x-yaml',
    };
  }

  /**
   * Get HTML documentation
   */
  private async getDocumentation(role: OICPRole): Promise<{contents: string; mimeType: string}> {
    const filePath = join(this.basePath, 'oicp', 'v2.3', role, 'index.html');
    const contents = await readFile(filePath, 'utf-8');

    return {
      contents,
      mimeType: 'text/html',
    };
  }

  /**
   * Get image file
   */
  private async getImage(role: OICPRole, imageName: string): Promise<{contents: string; mimeType: string}> {
    const filePath = join(this.basePath, 'oicp', 'v2.3', role, 'images', imageName);
    const contents = await readFile(filePath, 'base64');

    return {
      contents,
      mimeType: this.getImageMimeType(imageName),
    };
  }

  /**
   * List all image files for a role
   */
  private async listImages(role: OICPRole): Promise<string[]> {
    const imagesPath = join(this.basePath, 'oicp', 'v2.3', role, 'images');
    try {
      const files = await readdir(imagesPath);
      return files.filter((file) => /\.(png|jpg|jpeg|gif|svg)$/i.test(file));
    } catch (error) {
      // If directory doesn't exist or can't be read, return empty array
      return [];
    }
  }

  /**
   * Get MIME type for an image file
   */
  private getImageMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      case 'svg':
        return 'image/svg+xml';
      default:
        return 'application/octet-stream';
    }
  }
}

